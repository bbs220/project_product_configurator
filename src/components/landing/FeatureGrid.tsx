"use client";

import { motion } from "motion/react";
import { Layers, Zap, Download } from "lucide-react";

const features = [
  {
    title: "Modular Design",
    description:
      "Swap materials, alter geometries, and construct your perfect product piece by piece with our intuitive sidebar.",
    icon: Layers,
  },
  {
    title: "Real-time Rendering",
    description:
      "Experience zero lag. Our WebGL engine delivers stunning 60FPS 3D rendering with dynamic lighting and shadows.",
    icon: Zap,
  },
  {
    title: "Instant Export",
    description:
      "Generate PDF summaries, grab high-resolution screenshots, and sync your configuration instantly to the checkout.",
    icon: Download,
  },
];

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="w-full max-w-7xl px-6 md:px-12 py-24 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="flex flex-col items-start text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
