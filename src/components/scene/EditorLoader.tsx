"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";

const EditorLoader = () => {
  const { progress, active, loaded, total } = useProgress();
  const isLoading = active || progress < 100;

  return (
    <AnimatePresence>
      {isLoading && (
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
              {progress.toFixed(0)}%
            </div>
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
              <span>Loading Assets</span>
              {total > 0 && (
                <span className="opacity-60 lowercase">
                  ({loaded}/{total})
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
