export const defaultMarkdown = `# MarkBloom

Create **beautiful PDFs** from Markdown, styled with [Tailwind CSS](https://tailwindcss.com). Write in the editor, preview instantly, and export to PDF with a single click.

## Headings

### Heading Level 3

Each heading level has distinct sizing and weight to create a clear visual hierarchy. Headings support **bold**, *italic*, and \`inline code\` too.

## Lists

### Unordered List

- Live preview with instant rendering
- One-click PDF export
- Nested items are supported:
  - Multiple page sizes: A4, Letter, Legal
  - Syntax highlighting for 100+ languages
    - TypeScript, Python, Rust, Go, and more
- Clean, modern typography

### Ordered List

1. Write your content in Markdown
2. Preview the formatted output in real-time
3. Nested ordered lists work too:
   1. Adjust the page size if needed
   2. Customize the theme
4. Click **Export PDF** to generate your document

### Checklist

- [x] Markdown editor with syntax support
- [x] Live preview panel
- [x] PDF export functionality
- [x] Page size selection
- [ ] Custom theme support
- [ ] Template library


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

\`\`\`rust
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    let sum: i32 = numbers.iter().sum();
    println!("Sum of 1 to 10: {sum}");
}
\`\`\`

Code blocks without a language are also rendered:

\`\`\`
$ npm install markbloom
$ markbloom serve --port 3000
Server running at http://localhost:3000
\`\`\`

## Tables

| Feature           | Description                        | Status       |
|-------------------|------------------------------------|--------------|
| Markdown Parsing  | Full CommonMark + GFM support      | Ready        |
| Live Preview      | Real-time rendered output          | Ready        |
| PDF Export        | One-click document generation      | Ready        |
| Syntax Highlight  | Shiki with GitHub Dark theme       | Ready        |
| Mermaid Diagrams  | Flowcharts, sequences, and more    | Ready        |
| Math / LaTeX      | KaTeX-powered equation rendering   | Ready        |
| HTML Support      | Inline HTML like GitHub            | Ready        |
| Custom Themes     | User-defined color schemes         | Coming Soon  |


## Blockquotes

> "Simplicity is the ultimate sophistication."
> -- Leonardo da Vinci

> **Tip:** You can nest *any* Markdown syntax inside blockquotes, including **bold text**, and [links](https://example.com).
>
> > Nested blockquotes are also supported.


## HTML Support

Inline HTML is supported, just like on GitHub.

<p align="center">
  <img src="https://placehold.co/200x200/f4f4f5/a1a1aa?text=HTML" alt="HTML Example" width="200" height="200">
</p>

<h3 align="center">Centered headings and images work out of the box.</h3>

<details>
<summary>Click to expand</summary>

This content is hidden by default and revealed when the user clicks the summary. Markdown inside HTML blocks works too: **bold**, *italic*, \`code\`.

</details>


## Diagrams

Mermaid diagrams are rendered automatically from fenced code blocks.

### Flowchart

\`\`\`mermaid
graph TD
    A[Write Markdown] --> B[Live Preview]
    B --> C{Satisfied?}
    C -->|Yes| D[Export PDF]
    C -->|No| A
    D --> E[Done!]
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor
    participant Preview
    participant PDF

    User->>Editor: Write Markdown
    Editor->>Preview: Render content
    Preview-->>User: Visual feedback
    User->>PDF: Click Export
    PDF-->>User: Download file
\`\`\`

## Math & LaTeX

Inline math works with single dollar signs: $E = mc^2$ and $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$.

Block equations use double dollar signs:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)
$$

### Matrix

$$
A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}
$$

### Aligned Equations

$$
\\begin{aligned}
  (a + b)^2 &= a^2 + 2ab + b^2 \\\\
  (a - b)^2 &= a^2 - 2ab + b^2 \\\\
  (a + b)(a - b) &= a^2 - b^2
\\end{aligned}
$$


## Images

![Placeholder](https://placehold.co/800x300/f4f4f5/a1a1aa?text=MarkBloom+Image+Preview)


*Created with MarkBloom*
`;
