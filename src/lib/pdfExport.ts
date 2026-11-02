import { jsPDF } from "jspdf";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

export type PdfExportOptions = {
  modelKey: string;
  signerName?: string;
  signerEmail?: string;
  signatureDataUrl?: string;
  onProgress?: (message: string) => void;
};

type ComponentSpec = {
  name: string;
  color: string;
  roughness: number;
  metalness: number;
};

// capture composite canvas image and return data with aspect ratio
type CaptureResult = {
  dataUrl: string;
  aspect: number;
};

// model display titles mapping
const modelTitles: Record<string, string> = {
  watch: "Apple Watch Ultra 2 (2023)",
  keyboard: "Knob1 Mechanical Keyboard (2024)",
  mtBike: "Santa Cruz V10 (2023)",
  guitar: "Fender Stratocaster (1954)",
};

// delay utility to wait for animations to settle
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// convert hex color string to rgb tuple
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;
  const num = parseInt(fullHex, 16);
  if (Number.isNaN(num)) return [128, 128, 128];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// collect active component materials based on selected model
function getModelSpecifications(modelKey: string): {
  specs: ComponentSpec[];
  extraDetails: string[];
} {
  const state = useConfiguratorStore.getState();

  switch (modelKey) {
    case "watch":
      return {
        specs: [
          { name: "Chassis & Case", ...state.watchMaterials.case },
          { name: "Alpine Loop Band", ...state.watchMaterials.band },
          { name: "Digital Crown & Ring", ...state.watchMaterials.crown },
          { name: "Display Face Lens", ...state.watchMaterials.face },
          { name: "Ceramic Back Plate", ...state.watchMaterials.back },
        ],
        extraDetails: [
          `Watch Face Style: ${state.watchFaceStyle.toUpperCase()}`,
          `Night Mode: ${state.watchNightMode ? "ACTIVE (RED TINT)" : "STANDARD"}`,
        ],
      };
    case "keyboard":
      return {
        specs: [
          { name: "Aluminum Chassis Base", ...state.keyboardMaterials.base },
          { name: "Keycaps & Legends", ...state.keyboardMaterials.keycaps },
          { name: "Switch Plate Layer", ...state.keyboardMaterials.switches },
          { name: "Rotary Encoder Knob", ...state.keyboardMaterials.knobs },
        ],
        extraDetails: [
          `OLED Screen Mode: ${state.keyboardDisplayStyle.toUpperCase()}`,
          `Color Theme: ${state.keyboardDisplayTheme.toUpperCase()}`,
          `Brightness Level: ${Math.round(state.keyboardDisplayBrightness * 100)}%`,
        ],
      };
    case "mtBike":
      return {
        specs: [
          { name: "Carbon Frame Chassis", ...state.bikeMaterials.frame },
          { name: "Wheel Rims & Hubs", ...state.bikeMaterials.wheels },
          { name: "Front & Rear Suspension", ...state.bikeMaterials.suspension },
          { name: "Drivetrain & Crankset", ...state.bikeMaterials.drivetrain },
        ],
        extraDetails: [
          "Geometry: Downhill 29/27.5 Mixed Setup",
          "Drivetrain: SRAM High Pivot System",
        ],
      };
    case "guitar":
      return {
        specs: [
          { name: "Contoured Body", ...state.guitarMaterials.body },
          { name: "Maple Neck & Headstock", ...state.guitarMaterials.neck },
          { name: "Chrome Hardware & Bridge", ...state.guitarMaterials.hardware },
          { name: "Single-Ply Pickguard", ...state.guitarMaterials.pickguard },
        ],
        extraDetails: [
          "Pickups: Custom 1954 Single-Coil Trio",
          "Frets: 21 Vintage Narrow Tall",
        ],
      };
    default:
      return { specs: [], extraDetails: [] };
  }
}

// crop canvas to square aspect ratio
function cropCanvasToSquare(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;
  const squareSize = Math.min(srcW, srcH);
  const cropX = Math.round((srcW - squareSize) / 2);
  const cropY = Math.round((srcH - squareSize) / 2);

  const dest = document.createElement("canvas");
  dest.width = squareSize;
  dest.height = squareSize;
  const ctx = dest.getContext("2d");
  if (ctx) {
    ctx.drawImage(
      sourceCanvas,
      cropX,
      cropY,
      squareSize,
      squareSize,
      0,
      0,
      squareSize,
      squareSize,
    );
  }
  return dest;
}

// capture standard canvas image without labels
function captureCanvasImage(stageEl: HTMLElement): string | null {
  const canvas = stageEl.querySelector("canvas");
  if (!canvas) return null;
  const cropped = cropCanvasToSquare(canvas);
  return cropped.toDataURL("image/png");
}

// composite canvas and billboarding labels in square aspect ratio
function captureCanvasWithLabels(stageEl: HTMLElement): CaptureResult | null {
  const canvas = stageEl.querySelector("canvas");
  if (!canvas) return null;

  try {
    const srcW = canvas.width;
    const srcH = canvas.height;
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width > 0 ? srcW / canvasRect.width : 1;
    const scaleY = canvasRect.height > 0 ? srcH / canvasRect.height : 1;

    // locate all billboarding label elements
    const labelNodes = stageEl.querySelectorAll<HTMLElement>(
      "[data-part-label], .select-none div",
    );

    let minLabelX = srcW;
    let maxLabelX = 0;
    let minLabelY = srcH;
    let maxLabelY = 0;

    labelNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const rawX = (rect.left - canvasRect.left) * scaleX;
      const rawY = (rect.top - canvasRect.top) * scaleY;
      minLabelX = Math.min(minLabelX, rawX);
      maxLabelX = Math.max(maxLabelX, rawX + rect.width * scaleX);
      minLabelY = Math.min(minLabelY, rawY);
      maxLabelY = Math.max(maxLabelY, rawY + rect.height * scaleY);
    });

    // calculate bounds to include all labels without clipping
    const padding = 28 * Math.max(scaleX, scaleY);
    let squareSize = Math.min(srcW, srcH);

    if (minLabelX < maxLabelX && minLabelY < maxLabelY) {
      const neededW = maxLabelX - minLabelX + padding * 2;
      const neededH = maxLabelY - minLabelY + padding * 2;
      squareSize = Math.min(
        srcW,
        Math.max(srcH, Math.max(neededW, neededH)),
      );
    }

    let cropX = Math.round((srcW - squareSize) / 2);
    let cropY = Math.round((srcH - squareSize) / 2);

    if (minLabelX < maxLabelX) {
      if (cropX > minLabelX - padding) {
        cropX = Math.max(0, minLabelX - padding);
      }
      if (cropX + squareSize < maxLabelX + padding) {
        cropX = Math.max(0, maxLabelX + padding - squareSize);
      }
    }

    if (minLabelY < maxLabelY) {
      if (cropY > minLabelY - padding) {
        cropY = Math.max(0, minLabelY - padding);
      }
      if (cropY + squareSize < maxLabelY + padding) {
        cropY = Math.max(0, maxLabelY + padding - squareSize);
      }
    }

    const offscreen = document.createElement("canvas");
    offscreen.width = squareSize;
    offscreen.height = squareSize;
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      return { dataUrl: canvas.toDataURL("image/png"), aspect: 1 };
    }

    // draw square cropped webgl canvas
    ctx.drawImage(
      canvas,
      cropX,
      cropY,
      squareSize,
      squareSize,
      0,
      0,
      squareSize,
      squareSize,
    );

    labelNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const title =
        node.getAttribute("data-label-title") ||
        node.textContent?.replace(/\s+/g, " ").trim();
      if (!title) return;

      // transform coordinates into cropped offscreen canvas space
      const rawX = (rect.left - canvasRect.left) * scaleX;
      const rawY = (rect.top - canvasRect.top) * scaleY;
      const x = rawX - cropX;
      const y = rawY - cropY;
      const w = rect.width * scaleX;
      const h = rect.height * scaleY;
      const radius = h / 2;

      ctx.save();
      // pill background styling
      ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
      ctx.strokeStyle = "rgba(210, 215, 220, 0.9)";
      ctx.lineWidth = Math.max(1, 1.5 * scaleX);

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, radius);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
      ctx.stroke();

      // accent indicator circle
      const dotRadius = Math.max(2, 3 * scaleX);
      const dotX = x + 10 * scaleX;
      const dotY = y + h / 2;
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // label typography styling
      const fontSize = Math.max(10, Math.round(11 * scaleX));
      ctx.fillStyle = "#18181b";
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillText(title, x + 18 * scaleX, y + h / 2);
      ctx.restore();
    });

    return { dataUrl: offscreen.toDataURL("image/png"), aspect: 1 };
  } catch {
    return {
      dataUrl: canvas.toDataURL("image/png"),
      aspect: 1,
    };
  }
}

// generate downloadable product specification document
export async function generateProductPdf({
  modelKey,
  signerName,
  signerEmail,
  signatureDataUrl,
  onProgress,
}: PdfExportOptions): Promise<void> {
  // locate interactive viewport stage container
  const stageEl = document.getElementById("canvas-stage");
  if (!stageEl) {
    throw new Error("Configurator viewport stage not found");
  }

  const store = useConfiguratorStore.getState();
  const originalExploded = store.isExploded;
  const originalLabels = store.showLabels;

  let implodedImage: string | null = null;
  let explodedResult: CaptureResult | null = null;

  try {
    // prepare imploded capture view without labels
    onProgress?.("Framing imploded view...");
    store.setExploded(false);
    store.setLabels(false);
    await wait(700);

    // capture imploded viewport snapshot
    implodedImage = captureCanvasImage(stageEl);

    // prepare exploded capture view with component labels
    onProgress?.("Framing exploded view with labels...");
    store.setExploded(true);
    store.setLabels(true);
    await wait(800);

    // capture exploded viewport snapshot
    explodedResult = captureCanvasWithLabels(stageEl);
  } finally {
    // restore original user viewport toggle state
    store.setExploded(originalExploded);
    store.setLabels(originalLabels);
  }

  // construct multi page pdf specification document
  onProgress?.("Assembling specification sheet...");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const squareSize = contentWidth;

  // page one header background banner
  doc.setFillColor(18, 18, 20);
  doc.rect(0, 0, pageWidth, 28, "F");

  // interactive hyperlink navigating to root application
  const studioOrigin =
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}/`
      : "https://forma-config.vercel.app/";

  // brand wordmark and tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FORMA", margin, 13);
  doc.link(margin - 1, 6, 25, 9, { url: studioOrigin });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170);
  doc.text("SHAPE YOUR PRODUCT — SPECIFICATION SHEET", margin, 19);
  doc.link(margin - 1, 15, 68, 6, { url: studioOrigin });

  // model name and export timestamp
  const modelTitle = modelTitles[modelKey] || modelKey;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(modelTitle, pageWidth - margin, 13, { align: "right" });

  const exportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170);
  doc.text(`EXPORT DATE: ${exportDate.toUpperCase()}`, pageWidth - margin, 19, {
    align: "right",
  });

  // full width square imploded view
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("1. IMPLODED ASSEMBLY (CLEAN VIEW)", margin, 31);

  if (implodedImage) {
    doc.addImage(
      implodedImage,
      "PNG",
      margin,
      33,
      squareSize,
      squareSize,
      undefined,
      "FAST",
    );
  }

  // draw image border frame with enhanced stroke width
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, 33, squareSize, squareSize, 1.5, 1.5, "S");
  // restore baseline line width for subsequent elements
  doc.setLineWidth(0.2);

  let pageOneY = 222.5;

  // studio configuration overview card
  // material configurations section header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(39, 39, 42);
  doc.text("MATERIAL & COMPONENT SPECIFICATIONS", margin, pageOneY);

  pageOneY += 3.8;

  // table column headers background
  doc.setFillColor(24, 24, 27);
  doc.rect(margin, pageOneY, contentWidth, 5.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);

  const colComponentX = margin + 4;
  const colColorX = margin + 65;
  const colRoughnessX = margin + 115;
  const colMetalnessX = margin + 150;

  doc.text("COMPONENT", colComponentX, pageOneY + 3.8);
  doc.text("FINISH COLOR", colColorX, pageOneY + 3.8);
  doc.text("ROUGHNESS", colRoughnessX, pageOneY + 3.8);
  doc.text("METALNESS", colMetalnessX, pageOneY + 3.8);

  pageOneY += 5.5;

  // populate component specifications rows
  const { specs, extraDetails } = getModelSpecifications(modelKey);
  const rowHeight = 6.2;

  specs.forEach((spec, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 251);
    doc.setDrawColor(241, 243, 245);
    doc.rect(margin, pageOneY, contentWidth, rowHeight, "FD");

    // component label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(24, 24, 27);
    doc.text(spec.name, colComponentX, pageOneY + 4.2);

    // color swatch block
    const rgb = hexToRgb(spec.color);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(colColorX, pageOneY + 1.2, 3.8, 3.8, 0.8, 0.8, "FD");

    // hex color code
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(spec.color.toUpperCase(), colColorX + 6.5, pageOneY + 4.2);

    // roughness level
    const roughnessPercent = Math.round(spec.roughness * 100);
    const roughnessTag = roughnessPercent < 30 ? "Glossy" : roughnessPercent > 70 ? "Matte" : "Satin";
    doc.text(`${roughnessPercent}% (${roughnessTag})`, colRoughnessX, pageOneY + 4.2);

    // metalness level
    const metalnessPercent = Math.round(spec.metalness * 100);
    const metalnessTag = metalnessPercent > 50 ? "Metallic" : "Dielectric";
    doc.text(`${metalnessPercent}% (${metalnessTag})`, colMetalnessX, pageOneY + 4.2);

    pageOneY += rowHeight;
  });

  // optional extra details block
  if (extraDetails.length > 0) {
    pageOneY += 2;
    doc.setFillColor(244, 244, 245);
    doc.roundedRect(margin, pageOneY, contentWidth, 7, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(39, 39, 42);
    doc.text("STUDIO PARAMETERS:", margin + 4, pageOneY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(82, 82, 91);
    doc.text(extraDetails.join("   •   "), margin + 36, pageOneY + 4.5);
  }

  // begin page two for exploded inspection and specifications
  doc.addPage();

  // page two compact header background banner
  doc.setFillColor(18, 18, 20);
  doc.rect(0, 0, pageWidth, 16, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FORMA", margin, 11);
  doc.link(margin - 1, 4, 18, 8, { url: studioOrigin });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170);
  doc.text(`${modelTitle.toUpperCase()} — COMPONENT INSPECTION & AUTHORIZATION`, margin + 22, 11);

  // full width square exploded view with labels
  let pageTwoY = 21.5;
  const explodedSquareSize = squareSize;
  const explodedX = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("2. EXPLODED ASSEMBLY (WITH LABELS)", margin, pageTwoY);

  pageTwoY += 2;

  if (explodedResult?.dataUrl) {
    doc.addImage(
      explodedResult.dataUrl,
      "PNG",
      explodedX,
      pageTwoY,
      explodedSquareSize,
      explodedSquareSize,
      undefined,
      "FAST",
    );
  }

  // draw image border frame with enhanced stroke width
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(0.6);
  doc.roundedRect(
    explodedX,
    pageTwoY,
    explodedSquareSize,
    explodedSquareSize,
    1.5,
    1.5,
    "S",
  );
  // restore baseline line width for subsequent elements
  doc.setLineWidth(0.2);

  pageTwoY += explodedSquareSize + 12;

  // designer authentication and approval sign off section
  const signBoxY = pageTwoY;
  const signBoxH = 40;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(margin, signBoxY, contentWidth, signBoxH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(24, 24, 27);
  doc.text("DESIGNER VERIFICATION & APPROVAL SIGN-OFF", margin + 5, signBoxY + 6);

  // designer verification credential details
  const displaySigner = signerName || "Authorized Designer";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`CONFIGURED BY: ${displaySigner.toUpperCase()}`, margin + 5, signBoxY + 12.5);
  if (signerEmail) {
    doc.text(`ACCOUNT EMAIL: ${signerEmail}`, margin + 5, signBoxY + 17.5);
  }
  doc.text("AUTHENTICATION: CLERK SECURE VERIFIED SESSION", margin + 5, signBoxY + 22.5);

  // verification status badge stamp
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(margin + 5, signBoxY + 27, 48, 6.5, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(37, 99, 235);
  doc.text("FORMA VERIFIED CONFIGURATION", margin + 7.5, signBoxY + 31.2);

  // signature line and date fields
  const sigAreaX = margin + 86;
  const sigLineY = signBoxY + 29;
  const sigLineW = 52;
  const dateLineX = sigAreaX + 58;
  const dateLineW = 32;

  // embedded hand drawn or digital signature mark
  if (signatureDataUrl) {
    doc.addImage(
      signatureDataUrl,
      "PNG",
      sigAreaX,
      sigLineY - 14,
      46,
      13,
      undefined,
      "FAST",
    );
  } else {
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(8.5);
    doc.setTextColor(37, 99, 235);
    doc.text(displaySigner, sigAreaX + 2, sigLineY - 3);
  }

  doc.setDrawColor(161, 161, 170);
  doc.setLineWidth(0.3);
  doc.line(sigAreaX, sigLineY, sigAreaX + sigLineW, sigLineY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(113, 113, 122);
  doc.text("AUTHORIZED SIGNATURE", sigAreaX, sigLineY + 4);

  doc.line(dateLineX, sigLineY, dateLineX + dateLineW, sigLineY);
  doc.text(`DATE: ${exportDate.toUpperCase()}`, dateLineX, sigLineY + 4);
  doc.setLineWidth(0.2);

  // bottom footer metadata bar and page numbering
  const totalPages = doc.getNumberOfPages();
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);
    doc.setDrawColor(228, 228, 231);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(
      "FORMA STUDIO — PHOTOREALISTIC THREE DIMENSIONAL PRODUCT CONFIGURATION ENGINE",
      margin,
      pageHeight - 10,
    );
    doc.link(margin, pageHeight - 13, 120, 6, { url: studioOrigin });

    doc.text(
      `PAGE ${pageNum} OF ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      {
        align: "right",
      },
    );
  }

  // trigger browser pdf file download
  const sanitizedModel = modelKey.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const filename = `forma-${sanitizedModel}-specification.pdf`;

  try {
    doc.save(filename);
  } catch {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
