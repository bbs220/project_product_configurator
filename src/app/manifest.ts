import type { MetadataRoute } from "next";

// generate web application manifest for progressive web app support
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Forma 3D Product Configurator",
    short_name: "Forma 3D",
    description: "Photorealistic 3D product configurator and visualizer",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/appIcon.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/appIcon.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
