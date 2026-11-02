// capture scaled canvas snapshot for garage previews
export function captureStudioThumbnail(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const stageEl = document.getElementById("canvas-stage");
  const canvas = stageEl?.querySelector("canvas");
  if (!canvas || canvas.width === 0 || canvas.height === 0) return undefined;

  // target clean portrait card aspect ratio for garage preview
  const targetAspect = 3 / 4;
  const srcW = canvas.width;
  const srcH = canvas.height;
  const srcAspect = srcW / srcH;

  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  if (srcAspect > targetAspect) {
    // canvas is wider than target crop horizontal center
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) / 2);
  } else {
    // canvas is taller than target crop vertical center
    cropH = Math.round(srcW / targetAspect);
    cropY = Math.round((srcH - cropH) / 2);
  }

  // target output dimensions
  const destW = 450;
  const destH = 600;

  const offscreen = document.createElement("canvas");
  offscreen.width = destW;
  offscreen.height = destH;
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
    destW,
    destH
  );

  // export optimized webp data url
  return offscreen.toDataURL("image/webp", 0.75);
}
