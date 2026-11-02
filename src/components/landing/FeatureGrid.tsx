"use client";

import { motion } from "motion/react";
import {
  Box,
  BoxSelect,
  Cpu,
  FileText,
  PenTool,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// feature item specification definition
type FeatureItem = {
  title: string;
  tag: string;
  description: string;
  icon: LucideIcon;
};

// catalog of technical capabilities and platform architecture
const features: FeatureItem[] = [
  {
    title: "Client-Side GLB Asset Export",
    tag: "Three.js GLTFExporter",
    description:
      "Serialize customized geometry directly in-browser using binary glTF serialization. Embeds real-time PBR roughness, metalness, hex albedos, dynamic canvas textures, and isolated component hierarchies into self-contained files.",
    icon: Box,
  },
  {
    title: "A4 Engineering Specification Sheets",
    tag: "jsPDF & 2D Canvas Compositor",
    description:
      "Automated multi-page engineering documents capturing imploded and exploded assemblies with dynamic aspect-ratio adaptation. Features structured material telemetry tables with roughness, metalness, and hex color swatches.",
    icon: FileText,
  },
  {
    title: "Designer Verification & Signature Pad",
    tag: "HTML5 Canvas & Clerk Sessions",
    description:
      "Interactive pointer and stylus signing surface portaled to the root viewport. Stamps verified Clerk user credentials, official authorization seals, timestamped certification badges, and drawn digital signatures onto exported documentation.",
    icon: PenTool,
  },
  {
    title: "Kinematic Exploded Assembly & Labels",
    tag: "Spatial Billboarding & Lerp Kinematics",
    description:
      "Interpolated component separation across customized axes with real-time spatial annotation pills. Employs isolated CSS stacking contexts and depth bounds tracking to prevent visual clipping across viewports.",
    icon: BoxSelect,
  },
  {
    title: "Physically-Based WebGL Shader Pipeline",
    tag: "React Three Fiber & PostProcessing",
    description:
      "Photorealistic 60FPS rendering engine featuring ACESFilmic tone mapping, Screen Space Ambient Occlusion, Bloom highlights, soft directional shadow cascades, and high dynamic range studio environment lighting.",
    icon: Cpu,
  },
  {
    title: "Session-Gated Access Control",
    tag: "Clerk Authentication Middleware",
    description:
      "Granular security controls protecting proprietary 3D geometry exports and official engineering specifications behind authenticated sessions with seamless sign-in workflows and status notifications.",
    icon: ShieldCheck,
  },
];

// interactive feature showcase section component
export function FeatureGrid() {
  return (
    <section
      id="features"
      className="w-full max-w-7xl px-6 md:px-12 py-24 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Architecture & Capabilities
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 text-gray-900 dark:text-white">
          Engineered for Precision & Production
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-3xl">
          An end-to-end photorealistic 3D configurator platform combining real-time WebGL shaders, kinematic assembly inspection, automated engineering documentation, and client-side binary asset serialization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col items-start p-6 rounded-2xl bg-gray-50/60 dark:bg-zinc-900/40 border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-500/40 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5 shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
                {feature.tag}
              </span>
              <h3 className="text-lg font-bold mb-2.5 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
