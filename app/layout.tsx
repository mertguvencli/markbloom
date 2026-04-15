import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mertguvencli.github.io/markbloom";

export const metadata: Metadata = {
  title: "MarkBloom — Beautiful PDFs from Markdown | Free & Open Source",
  description:
    "Turn Markdown into beautiful, print-ready PDF documents. Professional typography, smart pagination, syntax-highlighted code blocks, and styled tables. Free, open-source, 100% client-side — your content never leaves your browser.",
  keywords: [
    "markdown to beautiful pdf",
    "markdown to pdf",
    "beautiful pdf from markdown",
    "professional pdf generator",
    "print-ready markdown",
    "markdown pdf converter",
    "styled markdown pdf",
    "markdown pdf export",
    "free markdown to pdf",
    "online markdown to pdf",
    "markdown smart pagination",
    "syntax highlighted pdf",
  ],
  authors: [{ name: "Mert Güvençli", url: "https://github.com/mertguvencli" }],
  creator: "Mert Güvençli",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    title: "MarkBloom — Beautiful PDFs from Markdown",
    description:
      "Turn Markdown into beautiful, print-ready PDFs with professional typography, smart pagination, and syntax-highlighted code. Free, open-source, runs in your browser.",
    url: siteUrl,
    siteName: "MarkBloom",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkBloom — Beautiful PDFs from Markdown",
    description:
      "Turn Markdown into beautiful, print-ready PDFs. Professional typography, smart pagination, syntax-highlighted code. Free & open-source.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MarkBloom",
  description:
    "Turn Markdown into beautiful, print-ready PDF documents with professional typography, smart pagination, and syntax-highlighted code blocks. Free, open-source, 100% client-side.",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web Browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Mert Güvençli",
    url: "https://github.com/mertguvencli",
  },
  softwareHelp: {
    "@type": "WebPage",
    url: "https://github.com/mertguvencli/markbloom",
  },
  isAccessibleForFree: true,
  license: "https://opensource.org/licenses/MIT",
  featureList: [
    "Beautiful, professionally formatted PDF output",
    "Smart pagination with intelligent page break detection",
    "Syntax-highlighted code blocks in PDF via Shiki",
    "Styled tables, task lists, and blockquotes in PDF",
    "Live preview — see your final PDF as you type",
    "Multiple page sizes: A4, Letter, Legal",
    "100% client-side — your content never leaves your browser",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create beautiful PDFs from Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open MarkBloom, write or paste your Markdown, and click Export PDF. MarkBloom automatically applies professional typography, smart page breaks, and polished styling to produce print-ready PDF documents. No sign-up or installation required.",
      },
    },
    {
      "@type": "Question",
      name: "Why do my Markdown PDFs look ugly with other tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most Markdown-to-PDF tools use basic styling with minimal attention to typography, pagination, or layout. MarkBloom is built specifically to produce beautiful output — with intelligent page breaks that avoid cutting tables or orphaning headings, syntax-highlighted code blocks, and professionally styled tables and lists.",
      },
    },
    {
      "@type": "Question",
      name: "What page sizes does MarkBloom support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MarkBloom supports A4, US Letter, and Legal page sizes for PDF export, each with proper margins and layout.",
      },
    },
    {
      "@type": "Question",
      name: "Is MarkBloom free and open source?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MarkBloom is completely free to use and open source under the MIT license. The source code is available on GitHub.",
      },
    },
    {
      "@type": "Question",
      name: "Does MarkBloom support GitHub Flavored Markdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MarkBloom supports GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, and syntax-highlighted code blocks — all rendered beautifully in the PDF output.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe with MarkBloom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MarkBloom runs entirely in your browser. Your Markdown content is never sent to any server — all processing and PDF generation happens locally on your device.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
