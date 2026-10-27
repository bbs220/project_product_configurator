"use client";

import { useEffect } from "react";
import { BoxSelect, Focus, Sparkles, Tag } from "lucide-react";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

type CanvasControlsProps = {
  className?: string;
};

// viewport explode, label, and floor reflection toggle controls
export default function CanvasControls({
  className = "",
}: CanvasControlsProps) {
  const {
    isExploded,
    toggleExploded,
    showLabels,
    toggleLabels,
    showFloor,
    toggleFloor,
    focus,
    toggleFocus,
    setExploded,
    setLabels,
  } = useConfiguratorStore();

  useEffect(() => {
    return () => {
      setExploded(false);
      setLabels(false);
    };
  }, [setExploded, setLabels]);

  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 shrink-0 ${className}`}
    >
      <button
        type="button"
        onClick={toggleExploded}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isExploded
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
        }`}
        title="Explode View"
      >
        <BoxSelect className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isExploded ? "Implode" : "Explode"}
        </span>
      </button>

      <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700" />

      <button
        type="button"
        onClick={toggleLabels}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          showLabels
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
        }`}
        title="Toggle Info Labels"
      >
        <Tag className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Labels</span>
      </button>

      <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700" />

      <button
        type="button"
        onClick={toggleFloor}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          showFloor
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
        }`}
        title="Toggle Floor Reflection"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Floor</span>
      </button>

      <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700" />

      <button
        type="button"
        onClick={toggleFocus}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          focus
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800"
        }`}
        title="Toggle Focus View"
      >
        <Focus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Focus</span>
      </button>
    </div>
  );
}
