"use client";

import { useSyncExternalStore } from "react";
import { Lock, PanelRightOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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

// track desktop viewport breakpoint for responsive animations
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia("(min-width: 1024px)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(min-width: 1024px)").matches
        : true,
    () => true,
  );
}

// configurator layout component properties definition
export type ConfiguratorLayoutProps = {
  canvas: React.ReactNode;
  sidebar: React.ReactNode;
};

// smooth cubic easing configuration for sidebar slide
const slideTransition = {
  duration: 0.32,
  ease: [0.32, 0.72, 0, 1] as const,
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
  const isDesktop = useIsDesktop();

  // default to open during server rendering
  const open = mounted ? isSidebarOpen : false;

  return (
    <main className="w-full h-[calc(100dvh-64px)] mt-16 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-black">
      {/* interactive model viewport stage */}
      <motion.section
        id="canvas-stage"
        className="relative h-1/2 lg:h-full overflow-hidden isolate"
        animate={{
          width: isDesktop ? (open ? "60%" : "100%") : "100%",
          height: isDesktop ? "100%" : open ? "50%" : "100%",
        }}
        transition={slideTransition}
      >
        {canvas}

        {/* top left stage navigation instructions without background */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 text-[11px] text-gray-500/90 dark:text-gray-400/90 select-none drop-shadow-sm pointer-events-none">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            L-Click
          </span>
          <span>Rotate</span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <div
            className="flex items-center gap-1"
            title={focus ? "Panning is disabled when focus is on" : undefined}
          >
            <span
              className={`font-semibold transition-colors ${
                focus
                  ? "text-red-500 line-through"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              R-Click
            </span>
            <span
              className={`transition-colors ${
                focus ? "line-through text-red-500" : ""
              }`}
            >
              Pan
            </span>
            {focus && <Lock className="w-3 h-3 text-red-500" />}
          </div>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Scroll
          </span>
          <span>Zoom</span>
        </div>

        {/* floating viewport controls on canvas stage */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100%-2rem)]">
          <CanvasControls />
        </div>

        {/* floating button to restore sidebar when minimized */}
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSidebar}
            aria-label="Open customization studio"
            className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-800 shadow-lg transition-colors"
          >
            <PanelRightOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Open Studio</span>
          </motion.button>
        )}
      </motion.section>

      {/* customization studio options panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="configurator-sidebar-panel"
            initial={
              isDesktop ? { width: 0, opacity: 0 } : { height: 0, opacity: 0 }
            }
            animate={
              isDesktop
                ? { width: "40%", opacity: 1 }
                : { height: "50%", opacity: 1 }
            }
            exit={
              isDesktop ? { width: 0, opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={slideTransition}
            className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/70 dark:bg-zinc-950/70 backdrop-blur-xl overflow-hidden shrink-0"
          >
            <motion.div
              initial={
                isDesktop ? { x: 80, opacity: 0 } : { y: 40, opacity: 0 }
              }
              animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0, opacity: 1 }}
              exit={isDesktop ? { x: 80, opacity: 0 } : { y: 40, opacity: 0 }}
              transition={slideTransition}
              className="w-full lg:w-[40vw] h-full flex flex-col overflow-hidden"
            >
              {sidebar}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
