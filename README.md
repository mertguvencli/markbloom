# MarkBloom

Turn your Markdown into beautiful, print-ready PDF documents. Open-source and runs entirely in your browser.

Write in the editor, see the final result live, and export to PDF with one click. Smart pagination, clean typography, and syntax-highlighted code blocks included.


![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Why MarkBloom?

MarkBloom is built with one goal: **beautiful PDF documents** from your Markdown.

- **Professional Typography** - Clean heading hierarchy, balanced spacing, and print-optimized font rendering
- **Smart Pagination** - Page breaks that avoid cutting tables mid-row or orphaning headings
- **Syntax-Highlighted Code** - 100+ languages with Shiki (GitHub Dark theme)
- **Multiple Page Sizes** - A4, US Letter, and Legal with proper margins
- **Styled Tables & Lists** - Bordered tables, task lists, and nested content that look good in PDF
- **Live Preview** - See how your PDF will look as you type

## Quick Start

```bash
git clone https://github.com/mertguvencli/markbloom.git
cd markbloom
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Write or paste Markdown in the editor
2. See a live preview of your PDF output
3. Choose your page size (A4, Letter, or Legal)
4. Click **Export PDF**

Everything runs in your browser. Your content never leaves your device.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Editor | CodeMirror 6 |
| Markdown | React Markdown, Remark GFM, Rehype Raw |
| Code Highlighting | Shiki |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| PDF Generation | html2canvas-pro, jsPDF |

## Build & Deploy

```bash
pnpm build
pnpm start
```

Configured for static export. Deploy to GitHub Pages or any static hosting provider.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

[MIT](LICENSE)
