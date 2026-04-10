"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, placeholder as cmPlaceholder, rectangularSelection, crosshairCursor } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  },
  ".cm-content": {
    padding: "16px 0",
    minHeight: "100%",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: "oklch(0.556 0 0)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "oklch(0.205 0 0)",
  },
  ".cm-activeLine": {
    backgroundColor: "oklch(0.97 0 0 / 50%)",
  },
  ".cm-cursor": {
    borderLeftColor: "oklch(0.205 0 0)",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "oklch(0.80 0 0 / 60%)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.85 0 0 / 40%)",
  },
  ".cm-placeholder": {
    color: "oklch(0.556 0 0)",
  },
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  const handleChange = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      onChangeRef.current(update.state.doc.toString());
    }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        history(),
        EditorState.allowMultipleSelections.of(true),
        rectangularSelection(),
        crosshairCursor(),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        markdown({ codeLanguages: languages }),
        syntaxHighlighting(defaultHighlightStyle),
        editorTheme,
        cmPlaceholder("Start writing Markdown..."),
        handleChange,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden [&_.cm-editor]:h-full [&_.cm-editor]:outline-none"
    />
  );
}
