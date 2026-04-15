"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MarkdownPreview } from "@/components/markdown-preview";
import { usePdfExport } from "@/lib/use-pdf-export";
import { defaultMarkdown } from "@/lib/default-markdown";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, DownloadIcon, EyeIcon, XIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";

type PageSize = "a4" | "letter" | "legal";

const pageSizeLabels: Record<PageSize, string> = {
  a4: "A4",
  letter: "Letter",
  legal: "Legal",
};

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [editorWidth, setEditorWidth] = useState(35);
  const [previewOnly, setPreviewOnly] = useState(false);
  const dragging = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { exportPdf, exporting } = usePdfExport(previewRef, pageSize);

  useEffect(() => {
    if (!previewOnly) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOnly(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previewOnly]);

  const clampWidth = (pct: number) => Math.min(80, Math.max(20, pct));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setEditorWidth(clampWidth(pct));
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  const handleTouchStart = useCallback((_e: React.TouchEvent) => {
    dragging.current = true;

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const pct = ((touch.clientY - rect.top) / rect.height) * 100;
      setEditorWidth(clampWidth(pct));
    };

    const onTouchEnd = () => {
      dragging.current = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              MarkBloom
            </h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <p className="text-sm text-zinc-500">
            Beautiful PDFs from Markdown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPreviewOnly(true)}
            title="Preview only"
          >
            <Maximize2Icon className="size-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Select
            value={pageSize}
            onValueChange={(v) => setPageSize(v as PageSize)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(pageSizeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={exportPdf} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <DownloadIcon className="size-4" data-icon="inline-start" />
            )}
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <a
            href="https://github.com/mertguvencli/markbloom"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <svg className="size-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </Button>
          </a>
        </div>
      </header>

      {/* Main content */}
      <div ref={containerRef} className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Editor panel */}
        <div
          className="flex min-h-[200px] flex-col border-b border-zinc-200 md:min-h-0 md:min-w-[280px] md:border-b-0 md:border-r"
          style={{ flex: `0 0 ${editorWidth}%` }}
        >
          <div className="flex-1 overflow-hidden">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </div>

        {/* Resize handle */}
        <div
          className="hidden md:flex shrink-0 w-0 relative items-center justify-center cursor-col-resize group z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-zinc-300/50 transition-colors" />
          <div className="relative h-8 w-1 rounded-full bg-zinc-300 group-hover:bg-zinc-400 transition-colors" />
        </div>

        {/* Mobile resize handle */}
        <div
          className="flex md:hidden shrink-0 h-0 relative items-center justify-center cursor-row-resize group z-10"
          onTouchStart={handleTouchStart}
        >
          <div className="absolute inset-x-0 -top-1 -bottom-1 group-hover:bg-zinc-300/50 transition-colors" />
          <div className="relative w-8 h-1 rounded-full bg-zinc-300 group-hover:bg-zinc-400 transition-colors" />
        </div>

        {/* Preview panel */}
        <div className="flex min-h-[200px] flex-1 flex-col md:min-h-0 md:min-w-[280px]">
          <div className="flex-1 overflow-auto p-8 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
            <MarkdownPreview
              ref={previewRef}
              content={markdown}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>

      {/* Preview-only fullscreen modal */}
      {previewOnly && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex shrink-0 justify-end p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPreviewOnly(false)}
            >
              <Minimize2Icon className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto px-8 pb-8">
            <MarkdownPreview
              fluid
              content={markdown}
              pageSize={pageSize}
            />
          </div>
        </div>
      )}

      {/* SEO content — visible to crawlers, visually hidden from app UI */}
      <footer className="sr-only" aria-label="About MarkBloom">
        <h2>What is MarkBloom?</h2>
        <p>
          MarkBloom turns your Markdown into beautiful, print-ready PDF documents.
          Unlike other converters that produce bland, poorly formatted output,
          MarkBloom focuses on professional typography, smart pagination, and
          polished styling — so your PDFs actually look good. It runs entirely in
          your browser with no sign-up, no server uploads, and no data leaving
          your device.
        </p>

        <h2>Why MarkBloom Produces Better PDFs</h2>
        <ul>
          <li>Professional typography with clean heading hierarchy and balanced spacing</li>
          <li>Smart pagination that never cuts tables mid-row or orphans headings</li>
          <li>Syntax-highlighted code blocks rendered beautifully in PDF via Shiki</li>
          <li>Styled tables with borders, padding, and proper alignment in PDF output</li>
          <li>Task lists, blockquotes, and nested content that look polished in print</li>
          <li>Multiple page sizes: A4, US Letter, and Legal with proper margins</li>
          <li>Live preview — see exactly how your PDF will look as you type</li>
          <li>100% client-side — your content never leaves your browser</li>
          <li>Free and open source under the MIT license</li>
        </ul>

        <h2>How to Create Beautiful PDFs from Markdown</h2>
        <ol>
          <li>Open MarkBloom in your browser</li>
          <li>Write or paste your Markdown in the editor</li>
          <li>See a pixel-perfect live preview of your PDF output</li>
          <li>Select your page size (A4, Letter, or Legal)</li>
          <li>Click &quot;Export PDF&quot; to download your beautifully formatted document</li>
        </ol>

        <h2>Frequently Asked Questions</h2>
        <h3>How do I create beautiful PDFs from Markdown?</h3>
        <p>
          Open MarkBloom, write or paste your Markdown, and click Export PDF.
          MarkBloom automatically applies professional typography, smart page
          breaks, and polished styling to produce print-ready PDF documents.
          No sign-up or installation required.
        </p>

        <h3>Why do my Markdown PDFs look ugly with other tools?</h3>
        <p>
          Most Markdown-to-PDF tools use basic styling with minimal attention to
          typography, pagination, or layout. MarkBloom is built specifically to
          produce beautiful output — with intelligent page breaks that avoid
          cutting tables or orphaning headings, syntax-highlighted code blocks,
          and professionally styled tables and lists.
        </p>

        <h3>What page sizes does MarkBloom support?</h3>
        <p>MarkBloom supports A4, US Letter, and Legal page sizes for PDF export, each with proper margins and layout.</p>

        <h3>Is MarkBloom free and open source?</h3>
        <p>
          Yes. MarkBloom is completely free to use and open source under the MIT
          license. The source code is available on GitHub.
        </p>

        <h3>Does MarkBloom support GitHub Flavored Markdown?</h3>
        <p>
          Yes. MarkBloom supports GitHub Flavored Markdown (GFM) including
          tables, task lists, strikethrough, and syntax-highlighted code blocks —
          all rendered beautifully in the PDF output.
        </p>

        <h3>Is my data safe with MarkBloom?</h3>
        <p>
          Yes. MarkBloom runs entirely in your browser. Your Markdown content is
          never sent to any server — all processing and PDF generation happens
          locally on your device.
        </p>
      </footer>
    </div>
  );
}
