"use client";

import { BoxSelect, Tag } from "lucide-react";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

export default function CanvasControls() {
  const { isExploded, toggleExploded, showLabels, toggleLabels } = useConfiguratorStore();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 z-10 transition-all">
      <button
        onClick={toggleExploded}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isExploded
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title="Explode View"
      >
        <BoxSelect className="w-4 h-4" />
        <span className="hidden sm:inline">{isExploded ? "Implode" : "Explode"}</span>
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

      <button
        onClick={toggleLabels}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          showLabels
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title="Toggle Info Labels"
      >
        <Tag className="w-4 h-4" />
        <span className="hidden sm:inline">{showLabels ? "Hide Labels" : "Info Labels"}</span>
      </button>
    </div>
  );
}

