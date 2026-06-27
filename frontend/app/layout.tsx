import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Concisio — AI Text Summarizer",
  description:
    "Concisio is an AI-powered text summarization tool. Paste text or upload a file and get a concise summary instantly, powered by Google PEGASUS.",
  keywords: [
    "text summarization",
    "AI",
    "NLP",
    "PEGASUS",
    "summarizer",
    "concisio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
