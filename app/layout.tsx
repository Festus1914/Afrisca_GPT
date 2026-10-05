import type { Metadata, Viewport } from "next";
import Navigation from "./components/Navigation";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Afrisca GPT - AI Platform",
  description: "Your intelligent AI assistant for chat, image generation, editing, analysis, and content creation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' font-weight='bold' fill='%2310a37f'>A</text></svg>" />
      </head>
      <body className="flex flex-col h-screen bg-white">
        <Navigation />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
