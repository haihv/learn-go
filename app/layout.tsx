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

// Runs before paint so a stored/system dark preference never flashes light
const themeBootstrap = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${sourceSerif.variable} ${spaceMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
