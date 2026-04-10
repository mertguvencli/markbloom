import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
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
  title: "MarkBloom — Free Online Markdown to PDF Converter",
  description:
    "MarkBloom is a free, open-source Markdown to PDF converter. Write Markdown with live preview and export beautifully styled PDF documents with A4, Letter, and Legal page sizes. No sign-up required.",
  keywords: [
    "markdown to pdf",
    "markdown pdf converter",
    "markdown editor",
    "online markdown to pdf",
    "free markdown to pdf",
    "open source markdown editor",
    "markdown pdf export",
    "markdown preview",
    "tailwind pdf",
  ],
  authors: [{ name: "Mert Güvençli", url: "https://github.com/mertguvencli" }],
  creator: "Mert Güvençli",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    title: "MarkBloom — Free Online Markdown to PDF Converter",
    description:
      "Free, open-source Markdown to PDF converter with live preview. Export styled PDFs in A4, Letter, and Legal sizes. No sign-up required.",
    url: siteUrl,
    siteName: "MarkBloom",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkBloom — Free Online Markdown to PDF Converter",
    description:
      "Free, open-source Markdown to PDF converter with live preview. Export styled PDFs in A4, Letter, and Legal sizes.",
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
    "Free, open-source Markdown to PDF converter with live preview. Write Markdown and export beautifully styled PDF documents in A4, Letter, and Legal page sizes.",
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
    "Live Markdown editor with syntax highlighting",
    "Real-time preview with Tailwind Typography styling",
    "PDF export in A4, Letter, and Legal page sizes",
    "GitHub Flavored Markdown support",
    "Syntax-highlighted code blocks",
    "Runs entirely in the browser",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I convert Markdown to PDF online for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open MarkBloom in your browser, paste or type your Markdown in the editor, preview it in real time, then click Export PDF. No sign-up or installation required.",
      },
    },
    {
      "@type": "Question",
      name: "What page sizes does MarkBloom support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MarkBloom supports A4, US Letter, and Legal page sizes for PDF export.",
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
        text: "Yes. MarkBloom supports GitHub Flavored Markdown (GFM) including tables, task lists, strikethrough, and syntax-highlighted code blocks.",
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
