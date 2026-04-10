# MarkBloom

Free, open-source Markdown to PDF converter that runs entirely in your browser. Write Markdown, see a live preview, and export beautifully formatted PDFs — no sign-up, no server uploads. Your content never leaves your device.

[Live Demo](https://mertguvencli.github.io/markbloom)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Live Editor** — CodeMirror 6 powered Markdown editor with syntax highlighting
- **Real-Time Preview** — Instant side-by-side preview as you type
- **PDF Export** — One-click export with smart pagination and page break detection
- **Multiple Page Sizes** — A4, US Letter, and Legal support
- **GitHub Flavored Markdown** — Tables, task lists, strikethrough, and more
- **Syntax Highlighting** — 100+ languages with Shiki (GitHub Dark theme)
- **100% Client-Side** — Zero backend, zero data collection, complete privacy

## Getting Started

```bash
# Clone the repository
git clone https://github.com/mertguvencli/markbloom.git
cd markbloom

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
# Production build
pnpm build

# Start production server
pnpm start
```

The project is configured for static export and can be deployed to GitHub Pages or any static hosting provider.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

[MIT](LICENSE)
