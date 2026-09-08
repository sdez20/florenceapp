import type { Metadata } from "next";
import { Playfair_Display, Cormorant, Figtree } from "next/font/google";
import "./globals.css";

// Playfair Display — the display face: wordmark, every heading, category names,
// her own words in the archive. (Its lightest cut is 400; the mockups' 300
// simply renders as 400.)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Cormorant — all body text, at 15px / 1.62, light.
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

// Figtree — kept only for screens not yet rebuilt to the new design.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Florence",
  description: "Florence is a wellness companion for women.",
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
