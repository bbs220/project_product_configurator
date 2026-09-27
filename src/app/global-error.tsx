"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TriangleAlert className="w-8 h-8" strokeWidth={2} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            A critical error occurred while rendering this page.
            {error.digest && (
              <span className="block mt-2 text-xs opacity-70">
                Error ID: {error.digest}
              </span>
            )}
          </p>

          <button
            onClick={() => reset()}
            className="w-full py-3 mt-4 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
