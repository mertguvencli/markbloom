"use client";

import { useCallback, useState, type RefObject } from "react";

type PageSize = "a4" | "letter" | "legal";

const pageFormats: Record<PageSize, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
};

/**
 * Scan a horizontal line of pixels and return true if it's all white (or near-white).
 * This is used to find safe page break points between content blocks.
 */
function isRowBlank(
  imageData: ImageData,
  canvasWidth: number,
  y: number
): boolean {
  const offset = y * canvasWidth * 4;
  for (let x = 0; x < canvasWidth; x++) {
    const i = offset + x * 4;
    // Allow near-white (threshold 250) to handle anti-aliasing
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

interface TableRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface TableInfo {
  rowBoundaries: number[];
  tableRects: TableRect[];
}

/**
 * Collect Y boundaries (in canvas pixels) of every table row inside the
 * preview element, plus bounding rects of each table wrapper.
 */
function collectTableInfo(
  element: HTMLElement,
  scale: number
): TableInfo {
  const containerRect = element.getBoundingClientRect();
  const boundaries = new Set<number>();
  const tableRects: TableRect[] = [];

  element.querySelectorAll("table").forEach((table) => {
    const tableRect = table.getBoundingClientRect();
    // Use the wrapper div (overflow-hidden rounded-lg) for positioning
    const wrapper = table.parentElement;
    const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : tableRect;

    tableRects.push({
      top: Math.round((wrapperRect.top - containerRect.top) * scale),
      bottom: Math.round((wrapperRect.bottom - containerRect.top) * scale),
      left: Math.round((wrapperRect.left - containerRect.left) * scale),
      right: Math.round((wrapperRect.right - containerRect.left) * scale),
    });

    // Just above the table (safe to break here)
    boundaries.add(
      Math.round((tableRect.top - containerRect.top) * scale) - 1
    );

    table.querySelectorAll("tr").forEach((row) => {
      const rowRect = row.getBoundingClientRect();
      // Bottom edge of each row (between rows is safe)
      boundaries.add(
        Math.round((rowRect.bottom - containerRect.top) * scale)
      );
    });
  });

  return {
    rowBoundaries: Array.from(boundaries).sort((a, b) => a - b),
    tableRects,
  };
}

/**
 * Find the best Y position to break the page near `idealY`.
 * Prefers table row boundaries when the break falls inside a table,
 * otherwise searches for a blank row within a window above idealY.
 */
function findBreakPoint(
  imageData: ImageData,
  canvasWidth: number,
  canvasHeight: number,
  idealY: number,
  searchRange: number,
  tableRowBoundaries: number[]
): number {
  const maxY = Math.min(idealY, canvasHeight - 1);
  const minY = Math.max(0, idealY - searchRange);

  // First, try to snap to a table row boundary within the search range
  // Search the nearest boundary at or below idealY, then fall back upward
  let bestBoundary = -1;
  for (let i = tableRowBoundaries.length - 1; i >= 0; i--) {
    const b = tableRowBoundaries[i];
    if (b >= minY && b <= maxY) {
      bestBoundary = b;
      break; // closest to idealY from above
    }
  }
  if (bestBoundary >= 0) {
    return bestBoundary;
  }

  // No table boundary in range — fall back to blank-row scan
  for (let y = maxY; y >= minY; y--) {
    if (isRowBlank(imageData, canvasWidth, y)) {
      return y;
    }
  }

  // No blank row found — fall back to the ideal position
  return idealY;
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
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const { w: pdfWidthMm, h: pdfHeightMm } = pageFormats[pageSize];

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

      // Match the preview component's padding (40px top/bottom) in canvas pixels
      const paddingTopPx = 40 * scale;

      // Read all pixel data once for break-point scanning
      const ctx = canvas.getContext("2d")!;
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      // Search up to 20% of page height for a blank row
      const searchRange = Math.round(pdfPageHeightPx * 0.2);

      // Collect table row boundaries and bounding rects
      const tableInfo = collectTableInfo(element, scale);
      const tableRowBoundaries = tableInfo.rowBoundaries;

      // Page 1: full height (top padding is already baked into the canvas)
      // Page 2+: reduce usable height to reserve space for top padding
      const breakPoints: number[] = [0];
      let currentY = 0;
      let isFirstPage = true;

      while (currentY < canvasHeight) {
        const usableHeight = isFirstPage
          ? pdfPageHeightPx
          : pdfPageHeightPx - paddingTopPx;

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
          tableRowBoundaries
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

        // On pages after the first, offset content down to add top padding
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

        // Draw borders where tables are cut across pages
        const borderColor = "#e4e4e7"; // zinc-200
        const borderWidth = Math.round(scale);
        pageCtx.strokeStyle = borderColor;
        pageCtx.lineWidth = borderWidth;
        pageCtx.setLineDash([6 * scale, 4 * scale]);

        for (const table of tableInfo.tableRects) {
          // Table is cut at the top of this page (continuation from previous)
          if (table.top < srcY && table.bottom > srcY) {
            const lineY = drawY;
            pageCtx.beginPath();
            pageCtx.moveTo(table.left, lineY);
            pageCtx.lineTo(table.right, lineY);
            pageCtx.stroke();
          }

          // Table is cut at the bottom of this page (continues on next)
          const pageBottomY = srcY + srcH;
          if (table.top < pageBottomY && table.bottom > pageBottomY) {
            const lineY = drawY + srcH;
            pageCtx.beginPath();
            pageCtx.moveTo(table.left, lineY);
            pageCtx.lineTo(table.right, lineY);
            pageCtx.stroke();
          }
        }

        pageCtx.setLineDash([]);

        const pageData = pageCanvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(pageData, "JPEG", 0, 0, pdfWidthMm, pdfHeightMm, undefined, "FAST");
      }

      pdf.save("markbloom-export.pdf");
    } finally {
      setExporting(false);
    }
  }, [previewRef, pageSize]);

  return { exportPdf, exporting };
}
