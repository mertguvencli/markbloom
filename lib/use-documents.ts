"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultMarkdown } from "@/lib/default-markdown";

export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  /** Title follows the first line of content until the user renames manually. */
  autoTitle: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "markbloom:documents";
const ACTIVE_KEY = "markbloom:active-document";
const SAVE_DEBOUNCE_MS = 300;
const TITLE_MAX_LENGTH = 60;

function deriveTitle(content: string): string {
  for (const line of content.split("\n")) {
    const text = line
      .replace(/^#{1,6}\s+/, "")
      .replace(/[*_`~]/g, "")
      .trim();
    if (text) return text.slice(0, TITLE_MAX_LENGTH);
  }
  return "Untitled";
}

function createDoc(content: string): MarkdownDocument {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: deriveTitle(content),
    content,
    autoTitle: true,
    createdAt: now,
    updatedAt: now,
  };
}

function loadDocuments(): MarkdownDocument[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as MarkdownDocument[];
  } catch {
    return null;
  }
}

export function useDocuments() {
  const [documents, setDocuments] = useState<MarkdownDocument[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  // localStorage is unavailable during prerender, so load after mount.
  useEffect(() => {
    const docs = loadDocuments() ?? [createDoc(defaultMarkdown)];
    const storedActive = localStorage.getItem(ACTIVE_KEY);
    setDocuments(docs);
    setActiveId(
      docs.some((d) => d.id === storedActive) ? storedActive : docs[0].id
    );
    setReady(true);
  }, []);

  // Debounced so typing doesn't serialize the whole list on every keystroke.
  useEffect(() => {
    if (!ready) return;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
      } catch {
        // Storage full or blocked — keep editing in memory.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(saveTimer.current);
  }, [documents, activeId, ready]);

  const activeDocument =
    documents.find((d) => d.id === activeId) ?? null;

  const createDocument = useCallback(() => {
    const doc = createDoc("");
    setDocuments((docs) => [doc, ...docs]);
    setActiveId(doc.id);
  }, []);

  const selectDocument = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateContent = useCallback(
    (content: string) => {
      if (!activeId) return;
      setDocuments((docs) =>
        docs.map((d) =>
          d.id === activeId
            ? {
                ...d,
                content,
                title: d.autoTitle ? deriveTitle(content) : d.title,
                updatedAt: Date.now(),
              }
            : d
        )
      );
    },
    [activeId]
  );

  const renameDocument = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setDocuments((docs) =>
      docs.map((d) =>
        d.id === id
          ? { ...d, title: trimmed.slice(0, TITLE_MAX_LENGTH), autoTitle: false }
          : d
      )
    );
  }, []);

  const deleteDocument = useCallback(
    (id: string) => {
      let remaining = documents.filter((d) => d.id !== id);
      if (remaining.length === 0) remaining = [createDoc(defaultMarkdown)];
      setDocuments(remaining);
      if (activeId === id) setActiveId(remaining[0].id);
    },
    [documents, activeId]
  );

  return {
    ready,
    documents,
    activeId,
    activeDocument,
    createDocument,
    selectDocument,
    updateContent,
    renameDocument,
    deleteDocument,
  };
}
