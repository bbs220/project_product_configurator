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
      className={`flex items-center gap-1 p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg ${className}`}
    >
      <button
        type="button"
        onClick={toggleExploded}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          isExploded
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title="Explode View"
      >
        <BoxSelect className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">
          {isExploded ? "Implode" : "Explode"}
        </span>
      </button>

      <button
        type="button"
        disabled={focus}
        onClick={toggleLabels}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          focus
            ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
            : showLabels
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title={focus ? "Labels disabled during part focus" : "Toggle Info Labels"}
      >
        <Tag className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Labels</span>
      </button>

      <button
        type="button"
        onClick={toggleFloor}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          showFloor
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title="Toggle Floor Reflection"
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Floor</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (!focus) {
            setLabels(false);
          }
          toggleFocus();
        }}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          focus
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        title={
          focus
            ? "Focus View: Active (Panning, rotation, zoom disabled)"
            : "Toggle Focus View"
        }
      >
        <Focus className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">Focus</span>
      </button>
    </div>
  );
}
