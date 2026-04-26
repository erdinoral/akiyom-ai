import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AKİYOM AI | Tek AI Merkezi",
  description:
    "AI Video, AI Image, AI Text ve AI Sound akışlarını tek panelde birleştiren AKİYOM AI landing sayfası.",
  openGraph: {
    title: "AKİYOM AI | Tek AI Merkezi",
    description:
      "Tüm üretim akışlarını tek merkezden yönet: Video, görsel, metin ve ses.",
    url: "https://ai.akiyom.com",
    siteName: "AKİYOM AI",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKİYOM AI | Tek AI Merkezi",
    description:
      "Video, görsel, metin ve ses iş akışlarını tek panelde yönet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
