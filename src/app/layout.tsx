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
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://forma-config.vercel.app/"),
  title: {
    default: "forma — shape your product",
    template: "%s | forma",
  },
  description: "shape your product",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/appIcon.png", type: "image/png" },
    ],
    apple: [{ url: "/appIcon.png" }],
  },
  openGraph: {
    title: "forma",
    description: "shape your product",
    url: "https://forma-config.vercel.app/",
    siteName: "forma",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/thumbnail_1200x630.png",
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
    images: ["/thumbnail_1200x630.png"],
  },
};

// structured data graph for search engines and ai agents
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "forma",
  url: "https://forma-config.vercel.app",
  description:
    "The next-generation 3D product configurator. Customize, visualize, and export photorealistic models in real-time.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="min-h-full flex flex-col overflow-x-hidden">
          {/* skip link for keyboard and screen reader navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-150 focus:px-4 focus:py-2 focus:bg-white focus:text-black dark:focus:bg-zinc-900 dark:focus:text-white focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-blue-500"
          >
            Skip to main content
          </a>
          <ThemeProvider>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
