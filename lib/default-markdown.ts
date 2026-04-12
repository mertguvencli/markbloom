export const defaultMarkdown = `# MarkBloom

Create **beautiful PDFs** from Markdown, styled with [Tailwind CSS](https://tailwindcss.com). Write in the editor, preview instantly, and export to PDF with a single click.

---

## Getting Started

This document showcases every supported Markdown element.

### Inline Formatting

You can write **bold**, *italic*, and ***bold italic*** text. Use \`inline code\` for technical terms like \`useState\` or \`next.config.ts\`. Links work too: [GitHub](https://github.com).

---

## Lists

### Unordered List

- Live preview with instant rendering
- One-click PDF export
- Multiple page sizes: A4, Letter, Legal
- Syntax highlighting for 100+ languages
- Clean, modern typography

### Ordered List

1. Write your content in Markdown
2. Preview the formatted output in real-time
3. Adjust the page size if needed
4. Click **Export PDF** to generate your document

### Checklist

- [x] Markdown editor with syntax support
- [x] Live preview panel
- [x] PDF export functionality
- [x] Page size selection
- [ ] Custom theme support
- [ ] Template library

---

## Code Blocks

Syntax highlighting uses Shiki with the **GitHub Dark** theme.

\`\`\`typescript
interface Document {
  title: string;
  content: string;
  createdAt: Date;
}

function createDocument(title: string, content: string): Document {
  return {
    title,
    content,
    createdAt: new Date(),
  };
}

const doc = createDocument("My Report", "# Hello World");
console.log(doc.title); // "My Report"
\`\`\`

\`\`\`python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Document:
    title: str
    content: str
    created_at: datetime = datetime.now()

    def word_count(self) -> int:
        return len(self.content.split())

doc = Document("My Report", "Hello World")
print(f"{doc.title}: {doc.word_count()} words")
\`\`\`

---

## Tables

| Feature           | Description                        | Status       |
|-------------------|------------------------------------|--------------|
| Markdown Parsing  | Full CommonMark support            | Ready        |
| Live Preview      | Real-time rendered output          | Ready        |
| PDF Export        | One-click document generation      | Ready        |
| Syntax Highlight  | Shiki code blocks                  | Ready        |
| Page Sizes        | A4, Letter, Legal formats          | Ready        |
| Custom Themes     | User-defined color schemes         | Coming Soon  |

---

## Blockquotes

> "Simplicity is the ultimate sophistication."
> -- Leonardo da Vinci

> **Tip:** You can nest *any* Markdown syntax inside blockquotes, including **bold text**, \`inline code\`, and [links](https://example.com).

---

## HTML Support

Inline HTML is supported, just like on GitHub.

<p align="center">
  <img src="/images/OpenAI_Paris_1x1.jpg" alt="Markdown Logo" width="128" height="80">
</p>

<h3 align="center">Centered headings and images work out of the box.</h3>

---

## Images

![Placeholder](https://placehold.co/800x300/f4f4f5/a1a1aa?text=MarkBloom+Image+Preview)

---

## Horizontal Rules

Use three dashes to create a horizontal rule.

---

### Heading Level 3

This is a paragraph under a level-3 heading. Each heading level has distinct sizing and weight to create a clear visual hierarchy.

---

*Created with MarkBloom*
`;
