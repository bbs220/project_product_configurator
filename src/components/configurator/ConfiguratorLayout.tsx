"use client";

import { useSyncExternalStore } from "react";
import { Lock, PanelRightOpen } from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import CanvasControls from "./CanvasControls";

// empty subscribe callback for client hydration sync
const emptySubscribe = () => () => {};

// track client mount state for hydration safety
function useClientMount(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// configurator layout component properties definition
export type ConfiguratorLayoutProps = {
  canvas: React.ReactNode;
  sidebar: React.ReactNode;
};

// interactive split layout supporting full screen canvas minimization
export default function ConfiguratorLayout({
  canvas,
  sidebar,
}: ConfiguratorLayoutProps) {
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const focus = useConfiguratorStore((s) => s.focus);
  const mounted = useClientMount();

  // default to open during server rendering
  const open = mounted ? isSidebarOpen : true;

  return (
    <main className="w-full h-[calc(100dvh-64px)] mt-16 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-black">
      {/* interactive model viewport stage */}
      <section
        id="canvas-stage"
        className={`relative h-1/2 lg:h-full overflow-hidden isolate transition-all duration-300 ${
          open ? "w-full lg:flex-1" : "w-full h-full flex-1"
        }`}
      >
        {canvas}

        {/* floating viewport controls on canvas stage */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100%-2rem)]">
          <CanvasControls />
        </div>

        {/* floating camera navigation hints */}
        <div className="absolute bottom-5 left-5 z-20 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-gray-200/70 dark:border-gray-800/70 shadow-sm text-[11px] text-gray-500 dark:text-gray-400 select-none">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-[10px] font-mono font-medium text-gray-700 dark:text-gray-300">
            L-Click
          </span>
          <span>Rotate</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <div
            className="flex items-center gap-1"
            title={focus ? "Panning is disabled when focus is on" : undefined}
          >
            <span
              className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium transition-colors ${
                focus
                  ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 line-through"
                  : "bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              R-Click
            </span>
            <span
              className={`transition-colors ${
                focus
                  ? "line-through text-red-600 dark:text-red-400 font-medium"
                  : ""
              }`}
            >
              Pan
            </span>
            {focus && (
              <Lock className="w-3 h-3 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-[10px] font-mono font-medium text-gray-700 dark:text-gray-300">
            Scroll
          </span>
          <span>Zoom</span>
        </div>

        {/* floating button to restore sidebar when minimized */}
        {!open && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open customization studio"
            className="absolute top-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-800 shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            <PanelRightOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Open Studio</span>
          </button>
        )}
      </section>

      {/* customization studio options panel */}
      {open && (
        <section className="w-full lg:w-[460px] xl:w-[480px] 2xl:w-[500px] lg:flex-none h-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/70 dark:bg-zinc-950/70 backdrop-blur-xl overflow-hidden transition-all duration-300">
          {sidebar}
        </section>
      )}
    </main>
  );
}
