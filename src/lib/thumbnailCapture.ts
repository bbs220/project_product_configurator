// capture scaled canvas snapshot for garage previews
export function captureStudioThumbnail(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const stageEl = document.getElementById("canvas-stage");
  const canvas = stageEl?.querySelector("canvas");
  if (!canvas || canvas.width === 0 || canvas.height === 0) return undefined;

  // target clean square aspect ratio for garage preview
  const targetAspect = 1;
  const srcW = canvas.width;
  const srcH = canvas.height;
  const srcAspect = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  if (srcAspect > targetAspect) {
    // canvas is wider than square crop horizontal center
    cropW = srcH;
    cropX = Math.round((srcW - cropW) / 2);
  } else {
    // canvas is taller than square crop vertical center
    cropH = srcW;
    cropY = Math.round((srcH - cropH) / 2);
  }

  // target output dimensions
  const destSize = 512;

  const offscreen = document.createElement("canvas");
  offscreen.width = destSize;
  offscreen.height = destSize;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return undefined;

  // draw centered unskewed region to preserve product geometry
  ctx.drawImage(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    destSize,
    destSize
  );

  // export optimized webp data url
  return offscreen.toDataURL("image/webp", 0.75);
}
