import type { Metadata } from "next";
import "./globals.css";

// Why this file exists:
// In Next.js App Router, layout files define the shared UI wrapper for a route and its children.
// The `app/layout.tsx` file is the Root Layout - it is mandatory and wraps the entire application.
// It defines the root HTML document structure (<html> and <body> tags).

// Next.js Metadata API (SEO Best Practice):
// Setting metadata here exports config that Next.js automatically injects into the HTML <head>.
// This is essential for search engines, tab titles, and page description previews.
export const metadata: Metadata = {
  title: "AI Expense Agent - Smart Receipt Scanning & Budget Tracking",
  description: "An intelligent companion that helps you scan receipts, track expenses, analyze spending, and budget smarter using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#090D16] text-white font-sans">
        {/* The 'children' prop represents whichever page or sub-layout is currently being rendered */}
        {children}
      </body>
    </html>
  );
}
