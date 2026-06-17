import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_SHORT, SITE_DESCRIPTION, BRAND } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  // Child pages set a bare title; the template appends the brand.
  title: { default: SITE_NAME, template: `%s — ${SITE_SHORT}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Go", "Golang", "learn Go", "Go tutorial", "interactive Go course",
    "Go programming", "Go for beginners", "Go labs", "Go workshops",
    "Go playground", "Go concurrency", "Go generics",
  ],
  authors: [{ name: "haihv" }],
  creator: "haihv",
  publisher: "haihv",
  category: "education",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.paper },
    { media: "(prefers-color-scheme: dark)", color: "#151311" },
  ],
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
      <body className={`${sourceSerif.variable} ${spaceMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
