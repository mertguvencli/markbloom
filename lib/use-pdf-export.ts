"use client";

import { useCallback, useState, type RefObject } from "react";

type PageSize = "a4" | "letter" | "legal";

const pageFormats: Record<PageSize, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
};

function isRowBlank(
  imageData: ImageData,
  canvasWidth: number,
  y: number
): boolean {
  const offset = y * canvasWidth * 4;
  for (let x = 0; x < canvasWidth; x++) {
    const i = offset + x * 4;
    if (
      imageData.data[i] < 250 ||
      imageData.data[i + 1] < 250 ||
      imageData.data[i + 2] < 250
    ) {
      return false;
    }
  }
  return true;
}

interface ElementRect {
  top: number;
  bottom: number;
}

interface LayoutInfo {
  rowBoundaries: number[];
  imageRects: ElementRect[];
}

function collectLayoutInfo(
  element: HTMLElement,
  scale: number
): LayoutInfo {
  const containerRect = element.getBoundingClientRect();
  const boundaries = new Set<number>();
  const imageRects: ElementRect[] = [];

  element.querySelectorAll("table").forEach((table) => {
    const tableRect = table.getBoundingClientRect();

    boundaries.add(
      Math.round((tableRect.top - containerRect.top) * scale) - 1
    );

    table.querySelectorAll("tr").forEach((row) => {
      const rowRect = row.getBoundingClientRect();
      boundaries.add(
        Math.round((rowRect.bottom - containerRect.top) * scale)
      );
    });
  });

  element.querySelectorAll("img").forEach((img) => {
    const imgRect = img.getBoundingClientRect();
    imageRects.push({
      top: Math.round((imgRect.top - containerRect.top) * scale),
      bottom: Math.round((imgRect.bottom - containerRect.top) * scale),
    });
  });

  return {
    rowBoundaries: Array.from(boundaries).sort((a, b) => a - b),
    imageRects,
  };
}

function findBreakPoint(
  imageData: ImageData,
  canvasWidth: number,
  canvasHeight: number,
  idealY: number,
  searchRange: number,
  tableRowBoundaries: number[],
  imageRects: ElementRect[],
  pageHeightPx: number
): number {
  const maxY = Math.min(idealY, canvasHeight - 1);
  const minY = Math.max(0, idealY - searchRange);

  // Find a candidate break point (table boundary or blank row)
  let candidate = -1;

  let bestBoundary = -1;
  for (let i = tableRowBoundaries.length - 1; i >= 0; i--) {
    const b = tableRowBoundaries[i];
    if (b >= minY && b <= maxY) {
      bestBoundary = b;
      break;
    }
  }
  if (bestBoundary >= 0) {
    candidate = bestBoundary;
  } else {
    for (let y = maxY; y >= minY; y--) {
      if (isRowBlank(imageData, canvasWidth, y)) {
        candidate = y;
        break;
      }
    }
  }

  if (candidate < 0) candidate = idealY;

  // Check if the candidate cuts through an image that could fit on a single page.
  // If so, move the break point above that image.
  for (const img of imageRects) {
    const imgHeight = img.bottom - img.top;
    if (
      candidate > img.top &&
      candidate < img.bottom &&
      imgHeight <= pageHeightPx
    ) {
      // Break just before the image (with a small gap)
      return Math.max(0, img.top - 2);
    }
  }

  return candidate;
}

export function usePdfExport(
  previewRef: RefObject<HTMLDivElement | null>,
  pageSize: PageSize
) {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    const element = previewRef.current;
    if (!element) return;

    setExporting(true);
    element.classList.add("pdf-exporting");
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const { w: pdfWidthMm, h: pdfHeightMm } = pageFormats[pageSize];

      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const scale = 2;
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const pdfPageHeightPx = (canvasWidth / pdfWidthMm) * pdfHeightMm;
      const paddingTopPx = 40 * scale;
      const paddingBottomPx = 40 * scale;

      const ctx = canvas.getContext("2d")!;
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      const searchRange = Math.round(pdfPageHeightPx * 0.2);

      const layoutInfo = collectLayoutInfo(element, scale);
      const tableRowBoundaries = layoutInfo.rowBoundaries;

      const breakPoints: number[] = [0];
      let currentY = 0;
      let isFirstPage = true;

      while (currentY < canvasHeight) {
        const usableHeight = isFirstPage
          ? pdfPageHeightPx - paddingBottomPx
          : pdfPageHeightPx - paddingTopPx - paddingBottomPx;

        const nextIdeal = currentY + usableHeight;
        if (nextIdeal >= canvasHeight) {
          breakPoints.push(canvasHeight);
          break;
        }
        const breakY = findBreakPoint(
          imageData,
          canvasWidth,
          canvasHeight,
          Math.round(nextIdeal),
          searchRange,
          tableRowBoundaries,
          layoutInfo.imageRects,
          pdfPageHeightPx
        );
        breakPoints.push(breakY);
        currentY = breakY;
        isFirstPage = false;
      }

      const pdf = new jsPDF({
        unit: "mm",
        format: [pdfWidthMm, pdfHeightMm],
        orientation: "portrait",
      });

      for (let i = 0; i < breakPoints.length - 1; i++) {
        if (i > 0) pdf.addPage();

        const srcY = breakPoints[i];
        const srcH = breakPoints[i + 1] - srcY;

        const drawY = i > 0 ? paddingTopPx : 0;

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvasWidth;
        pageCanvas.height = Math.round(pdfPageHeightPx);

        const pageCtx = pageCanvas.getContext("2d")!;
        pageCtx.fillStyle = "#ffffff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0, srcY, canvasWidth, srcH,
          0, drawY, canvasWidth, srcH
        );


        const pageData = pageCanvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(pageData, "JPEG", 0, 0, pdfWidthMm, pdfHeightMm, undefined, "FAST");
      }

      pdf.save("markbloom-export.pdf");
    } finally {
      element.classList.remove("pdf-exporting");
      setExporting(false);
    }
  }, [previewRef, pageSize]);

  return { exportPdf, exporting };
}
