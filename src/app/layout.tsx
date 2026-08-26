import type { Metadata } from "next";
import { Playfair_Display, Cormorant, Figtree } from "next/font/google";
import "./globals.css";

// Playfair Display — the display face. Wordmark, every heading, Explore category
// names, section headings, and her italic words in the archive.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Cormorant — the body face. All running copy, at 15px / 1.62.
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

// Figtree — the small-caps labels and buttons. Kept for legibility at tiny sizes.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Florence",
  description: "Florence — a wellness companion for women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
