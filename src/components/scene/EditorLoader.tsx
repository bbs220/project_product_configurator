"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EditorLoader = () => {
  const { progress, active, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);

  // refs are safe to write inside effects, unlike state
  const lastLoaded = useRef(0);
  const lastTotal = useRef(0);

  useEffect(() => {
    if (active) {
      lastLoaded.current = loaded;
      lastTotal.current = total;
    }
  }, [active, loaded, total]);

  useEffect(() => {
    if (!active) {
      // wait after loading to allow three js to compile shaders and push textures to gpu
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  // when done show a frozen snapshot at full completion, not the reset values
  const displayProgress = active ? progress : 100;
  // eslint-disable-next-line react-hooks/refs
  const displayLoaded = active ? loaded : lastLoaded.current;
  // eslint-disable-next-line react-hooks/refs
  const displayTotal = active ? total : lastTotal.current;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black"
        >
          <div className="flex flex-col items-center justify-center w-64">
            <div className="text-2xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-white">
              {displayProgress.toFixed(0)}%
            </div>
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
              <span>Loading Assets</span>
              {displayTotal > 0 && (
                <span className="opacity-60 lowercase">
                  ({displayLoaded}/{displayTotal})
                </span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorLoader;
