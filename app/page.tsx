"use client";

import { useRef, useState } from "react";
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
import { FileDown, FileText, Eye, Loader2, DownloadIcon } from "lucide-react";

type PageSize = "a4" | "letter" | "legal";

const pageSizeLabels: Record<PageSize, string> = {
  a4: "A4",
  letter: "Letter",
  legal: "Legal",
};

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportPdf, exporting } = usePdfExport(previewRef, pageSize);

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
            Free Online Markdown to PDF Converter
          </p>
        </div>

        <div className="flex items-center gap-2">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className="flex w-1/2 flex-col border-r border-zinc-200">
          {/* <div className="flex h-10 shrink-0 items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4">
            <FileText className="size-3.5 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-500">Editor</span>
          </div> */}
          <div className="flex-1 overflow-hidden">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex w-1/2 flex-col">
          {/* <div className="flex h-10 shrink-0 items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4">
            <Eye className="size-3.5 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-500">Preview</span>
          </div> */}
          <div className="flex-1 overflow-auto bg-zinc-100 p-8">
            <MarkdownPreview
              ref={previewRef}
              content={markdown}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>

      {/* SEO content — visible to crawlers, visually hidden from app UI */}
      <footer className="sr-only" aria-label="About MarkBloom">
        <h2>What is MarkBloom?</h2>
        <p>
          MarkBloom is a free, open-source Markdown to PDF converter that runs
          entirely in your browser. Write or paste Markdown in the editor, see a
          live-styled preview, and export to PDF in A4, Letter, or Legal page
          sizes — no sign-up, no server uploads, no data leaves your device.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Live Markdown editor with syntax highlighting powered by CodeMirror</li>
          <li>Real-time preview styled with Tailwind Typography</li>
          <li>One-click PDF export in A4, Letter, and Legal page sizes</li>
          <li>Full GitHub Flavored Markdown support: tables, task lists, strikethrough</li>
          <li>Syntax-highlighted code blocks via Shiki</li>
          <li>100% client-side — your content never leaves your browser</li>
          <li>Open source under the MIT license</li>
        </ul>

        <h2>How to Convert Markdown to PDF</h2>
        <ol>
          <li>Open MarkBloom in your browser</li>
          <li>Write or paste your Markdown in the left editor panel</li>
          <li>Preview the styled output in the right panel in real time</li>
          <li>Select your page size (A4, Letter, or Legal)</li>
          <li>Click &quot;Export PDF&quot; to download your document</li>
        </ol>

        <h2>Frequently Asked Questions</h2>
        <h3>How do I convert Markdown to PDF online for free?</h3>
        <p>
          Open MarkBloom in your browser, paste or type your Markdown in the
          editor, preview it in real time, then click Export PDF. No sign-up or
          installation required.
        </p>

        <h3>What page sizes does MarkBloom support?</h3>
        <p>MarkBloom supports A4, US Letter, and Legal page sizes for PDF export.</p>

        <h3>Is MarkBloom free and open source?</h3>
        <p>
          Yes. MarkBloom is completely free to use and open source under the MIT
          license. The source code is available on GitHub.
        </p>

        <h3>Does MarkBloom support GitHub Flavored Markdown?</h3>
        <p>
          Yes. MarkBloom supports GitHub Flavored Markdown (GFM) including
          tables, task lists, strikethrough, and syntax-highlighted code blocks.
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
