"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 shrink-0" />;
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else {
      // If system, toggle to the opposite of current system preference
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(isSystemDark ? "light" : "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="shrink-0 w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ||
      (theme === "system" &&
        mounted &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}
