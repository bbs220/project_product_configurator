// capture scaled canvas snapshot for garage previews
export function captureStudioThumbnail(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const stageEl = document.getElementById("canvas-stage");
  const canvas = stageEl?.querySelector("canvas");
  if (!canvas) return undefined;

  // target preview dimensions
  const thumbWidth = 480;
  const thumbHeight = 270;

  const offscreen = document.createElement("canvas");
  offscreen.width = thumbWidth;
  offscreen.height = thumbHeight;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return undefined;

  // draw and scale threejs buffer to preview dimensions
  ctx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

  // export optimized webp data url
  return offscreen.toDataURL("image/webp", 0.7);
}

