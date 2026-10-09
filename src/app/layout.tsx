import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: "forma",
  description: "shape your product",
  openGraph: {
    title: "forma",
    description: "shape your product",
    url: "https://forma.example.com",
    siteName: "forma",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/thumbnails/thumbnail_1200x630.png",
        width: 1200,
        height: 630,
        alt: "forma product configurator thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "forma",
    description: "shape your product",
    images: ["/images/thumbnails/thumbnail_1200x630.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col overflow-x-hidden">
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
