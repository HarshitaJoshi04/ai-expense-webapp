import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Why this file exists:
// In Next.js App Router, layout files define the shared UI wrapper for a route and its children.
// The `app/layout.tsx` file is the Root Layout - it is mandatory and wraps the entire application.
// It defines the root HTML document structure (<html> and <body> tags).

// Next.js Font Optimization:
// Next.js automatically downloads and hosts Google Fonts locally when building the project.
// This prevents layout shifts (CLS) and avoids making external requests to Google servers at runtime.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      // Apply Geist fonts globally using custom CSS variables (defined above)
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090D16] text-white">
        {/* The 'children' prop represents whichever page or sub-layout is currently being rendered */}
        {children}
      </body>
    </html>
  );
}

