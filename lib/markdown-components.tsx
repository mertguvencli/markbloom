"use client";

import { useEffect, useId, useState } from "react";
import type { Components } from "react-markdown";
import type { BundledLanguage } from "shiki";

function MermaidBlock({ children }: { children: string }) {
  const id = useId().replace(/:/g, "m");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
      });
      mermaid
        .render(`mermaid-${id}`, children.replace(/\n$/, ""))
        .then(({ svg: renderedSvg }: { svg: string }) => {
          if (!cancelled) setSvg(renderedSvg);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(String(err));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [children, id]);

  if (error) {
    return (
      <pre className="mb-5 rounded-lg border border-red-300 bg-red-50 text-red-700 p-4 text-sm">
        <code>{error}</code>
      </pre>
    );
  }

  if (svg) {
    return (
      <div
        className="mb-5 flex justify-center rounded-lg border border-zinc-200 bg-white p-4 [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <div className="mb-5 flex justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-400 text-sm">
      Rendering diagram…
    </div>
  );
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("shiki").then(({ codeToHtml }) => {
      if (cancelled) return;
      codeToHtml(children.replace(/\n$/, ""), {
        lang: language as BundledLanguage,
        theme: "github-dark",
      })
        .then((result) => {
          if (!cancelled) setHtml(result);
        })
        .catch(() => {
          // Unknown language — leave unhighlighted
        });
    });

    return () => {
      cancelled = true;
    };
  }, [children, language]);

  if (html) {
    return (
      <div
        className="mb-5 rounded-lg border border-zinc-800 overflow-hidden [&_pre]:m-0! [&_pre]:rounded-none! [&_pre]:border-0! [&_pre]:p-4 [&_code]:bg-transparent! [&_code]:p-0!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre className="mb-5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-50 p-4">
      <code>{children}</code>
    </pre>
  );
}

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-semibold tracking-tight border-b border-zinc-200 pb-3 mt-0 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold tracking-tight mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="leading-7">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} className="text-zinc-900 underline underline-offset-4">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-zinc-300 text-zinc-600">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const match = className?.match(/language-(\w+)/);
    if (match) {
      if (match[1] === "mermaid") {
        return <MermaidBlock>{String(children)}</MermaidBlock>;
      }
      return <CodeBlock language={match[1]} children={String(children)} />;
    }
    // Block code without a language (inside <pre>)
    if (!className && typeof children === "string" && children.includes("\n")) {
      return (
        <pre className="mb-5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-50 p-4">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="mb-5 rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-normal before:content-none after:content-none">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="overflow-hidden rounded-lg border border-zinc-200">
      <table className="text-sm m-0! border-collapse **:border-style-solid">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-r border-zinc-200 bg-zinc-50 px-3 py-2 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-r border-zinc-200 px-3 py-2 last:border-r-0 [tr:last-child_&]:border-b-0">
      {children}
    </td>
  ),
  hr: () => <hr className="border-zinc-100" />,
  img: ({ src, alt, width, height }) => (
    <img src={src} alt={alt ?? ""} width={width} height={height} className="rounded-lg" />
  ),
  li: ({ children }) => <li className="marker:text-black leading-4">{children}</li>,
};
