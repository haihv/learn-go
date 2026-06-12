import type { Metadata } from "next";
import { Source_Serif_4, Space_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  weight: ["600", "700"],
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Go Interactively",
  description:
    "An interactive Go course with lessons, workshops, and labs — modeled after freeCodeCamp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.variable} ${spaceMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
