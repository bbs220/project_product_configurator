"use client";

import { useSyncExternalStore } from "react";
import { PanelRightOpen } from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";

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
  const mounted = useClientMount();

  // default to open during server rendering
  const open = mounted ? isSidebarOpen : true;

  return (
    <main className="w-full h-[calc(100dvh-64px)] mt-16 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-black">
      {/* interactive model viewport stage */}
      <section
        id="canvas-stage"
        className={`relative h-1/2 lg:h-full overflow-hidden isolate transition-all duration-300 ${
          open ? "w-full lg:w-3/5 flex-1 lg:flex-none" : "w-full h-full flex-1"
        }`}
      >
        {canvas}

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
        <section className="w-full lg:w-2/5 h-1/2 lg:h-full lg:flex-none border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-zinc-950/50 overflow-hidden transition-all duration-300">
          {sidebar}
        </section>
      )}
    </main>
  );
}

