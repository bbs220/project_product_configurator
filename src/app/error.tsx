"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// handle unexpected runtime errors inside application routes
export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

