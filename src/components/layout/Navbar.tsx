"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { Box, UserCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// application header navigation component
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-100 w-full flex justify-between items-center px-8 md:px-12 h-16 min-h-16 shrink-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-none">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md"
        >
          <Image
            src="/appIcon.png"
            alt="forma logo"
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="font-bold text-2xl tracking-tighter">forma</span>
        </Link>
        <span className="hidden sm:inline-block text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide mt-1">
          shape your product
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* garage navigation shortcut */}
        <Link
          href="/garage"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Box className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>Garage</span>
        </Link>
        <ThemeToggle />
        <Show when="signed-out">
          <Link
            href="/sign-in"
            aria-label="Sign in"
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <UserCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </Link>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
};

export default Navbar;
