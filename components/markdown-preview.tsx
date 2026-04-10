"use client";

import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { markdownComponents } from "@/lib/markdown-components";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  pageSize: "a4" | "letter" | "legal";
}

const pageSizes = {
  a4: { width: "210mm", minHeight: "297mm" },
  letter: { width: "215.9mm", minHeight: "279.4mm" },
  legal: { width: "215.9mm", minHeight: "355.6mm" },
};

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, className, pageSize }, ref) {
    const size = pageSizes[pageSize];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white text-zinc-900 shadow-lg mx-auto",
          className
        )}
        style={{
          width: size.width,
          minHeight: size.minHeight,
          padding: "40px 50px",
        }}
      >
        <article className="prose prose-zinc max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    );
  }
);
