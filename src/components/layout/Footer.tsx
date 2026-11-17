"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// footer navigation and brand attribution component
const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/configurator") {
    return null;
  }

  // scroll viewport smoothly to top
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md mt-auto shrink-0 px-8 md:px-12 py-4 md:py-5 transition-colors">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {/* brand and attribution */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
          <Link
            href="/"
            onClick={handleScrollToTop}
            title="Scroll to top"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md cursor-pointer"
          >
            <Image
              src="/appIcon.png"
              alt="forma logo"
              width={20}
              height={20}
              className="rounded-sm"
            />
            <span className="font-bold text-lg tracking-tighter text-gray-900 dark:text-white">
              forma
            </span>
          </Link>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-700 select-none">
            •
          </span>
          <div className="inline-flex items-center gap-1.5">
            <span>Made by</span>
            <a
              href="https://github.com/bbs220"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 dark:text-white hover:underline transition-colors"
            >
              bbs220
            </a>
          </div>
          <span className="hidden md:inline text-gray-300 dark:text-gray-700 select-none">
            •
          </span>
          <span className="hidden md:inline">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* navigation links and legal notices */}
        <div className="flex items-center gap-5 sm:gap-6 font-medium">
          <a
            href="https://github.com/bbs220/project_product_configurator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </a>
          <Link
            href="/terms-of-service"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacypolicy"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
