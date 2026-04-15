"use client";

import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { markdownComponents } from "@/lib/markdown-components";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  pageSize: "a4" | "letter" | "legal";
  fluid?: boolean;
}

const pageSizes = {
  a4: { width: "210mm", minHeight: "297mm" },
  letter: { width: "215.9mm", minHeight: "279.4mm" },
  legal: { width: "215.9mm", minHeight: "355.6mm" },
};

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, className, pageSize, fluid }, ref) {
    const size = pageSizes[pageSize];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white text-zinc-900 mx-auto",
          !fluid && "shadow-lg",
          className
        )}
        style={fluid ? { maxWidth: "860px", width: "100%" } : {
          width: size.width,
          minHeight: size.minHeight,
          padding: !fluid && "40px 50px",
        }}
      >
        <article className="prose prose-zinc max-w-none" style={{ color: "#3f3f46" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    );
  }
);
