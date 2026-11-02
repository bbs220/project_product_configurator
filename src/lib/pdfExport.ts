import { jsPDF } from "jspdf";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

export type PdfExportOptions = {
  modelKey: string;
  onProgress?: (message: string) => void;
};

type ComponentSpec = {
  name: string;
  color: string;
  roughness: number;
  metalness: number;
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

// capture standard canvas image without labels
function captureCanvasImage(stageEl: HTMLElement): string | null {
  const canvas = stageEl.querySelector("canvas");
  if (!canvas) return null;
  return canvas.toDataURL("image/png");
}

// composite canvas and billboarding labels
function captureCanvasWithLabels(stageEl: HTMLElement): string | null {
  const canvas = stageEl.querySelector("canvas");
  if (!canvas) return null;

  try {
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return canvas.toDataURL("image/png");

    // transfer rendered three dimensions webgl scene
    ctx.drawImage(canvas, 0, 0);

    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) {
      return canvas.toDataURL("image/png");
    }

    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    // locate all billboarding label elements
    const labelNodes = stageEl.querySelectorAll<HTMLElement>(
      "[data-part-label], .select-none div",
    );

    labelNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const title =
        node.getAttribute("data-label-title") ||
        node.textContent?.replace(/\s+/g, " ").trim();
      if (!title) return;

      const x = (rect.left - canvasRect.left) * scaleX;
      const y = (rect.top - canvasRect.top) * scaleY;
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

    return offscreen.toDataURL("image/png");
  } catch {
    return canvas.toDataURL("image/png");
  }
}

// generate downloadable product specification document
export async function generateProductPdf({
  modelKey,
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
  let explodedImage: string | null = null;

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
    explodedImage = captureCanvasWithLabels(stageEl);
  } finally {
    // restore original user viewport toggle state
    store.setExploded(originalExploded);
    store.setLabels(originalLabels);
  }

  // construct pdf specification document
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

  // dark header background banner
  doc.setFillColor(18, 18, 20);
  doc.rect(0, 0, pageWidth, 28, "F");

  // brand wordmark and tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FORMA", margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(161, 161, 170);
  doc.text("SHAPE YOUR PRODUCT — SPECIFICATION SHEET", margin, 19);

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

  // visual views section header
  let currentY = 35;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(39, 39, 42);
  doc.text("VISUAL INSPECTION VIEWS", margin, currentY);

  currentY += 4;

  const cardWidth = contentWidth;
  const cardHeight = 70;

  // retrieve canvas aspect ratio for scaling
  const stageCanvas = stageEl.querySelector("canvas");
  const canvasAspect =
    stageCanvas && stageCanvas.height > 0
      ? stageCanvas.width / stageCanvas.height
      : 16 / 9;

  // imploded view full width presentation card
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "FD");

  doc.setFillColor(235, 236, 240);
  doc.roundedRect(margin + 3, currentY + 3, cardWidth - 6, 5.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(82, 82, 91);
  doc.text("1. IMPLODED ASSEMBLY (CLEAN VIEW)", margin + 5, currentY + 6.8);

  if (implodedImage) {
    const boxW = cardWidth - 8;
    const boxH = cardHeight - 12;
    let imgW = boxW;
    let imgH = imgW / canvasAspect;
    if (imgH > boxH) {
      imgH = boxH;
      imgW = imgH * canvasAspect;
    }
    const imgX = margin + 4 + (boxW - imgW) / 2;
    const imgY = currentY + 9.5 + (boxH - imgH) / 2;
    doc.addImage(implodedImage, "PNG", imgX, imgY, imgW, imgH, undefined, "FAST");
  }

  currentY += cardHeight + 4;

  // exploded view full width presentation card with labels
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "FD");

  doc.setFillColor(235, 236, 240);
  doc.roundedRect(margin + 3, currentY + 3, cardWidth - 6, 5.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(82, 82, 91);
  doc.text("2. EXPLODED ASSEMBLY (WITH LABELS)", margin + 5, currentY + 6.8);

  if (explodedImage) {
    const boxW = cardWidth - 8;
    const boxH = cardHeight - 12;
    let imgW = boxW;
    let imgH = imgW / canvasAspect;
    if (imgH > boxH) {
      imgH = boxH;
      imgW = imgH * canvasAspect;
    }
    const imgX = margin + 4 + (boxW - imgW) / 2;
    const imgY = currentY + 9.5 + (boxH - imgH) / 2;
    doc.addImage(explodedImage, "PNG", imgX, imgY, imgW, imgH, undefined, "FAST");
  }

  currentY += cardHeight + 6;

  // material configurations section header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(39, 39, 42);
  doc.text("MATERIAL & COMPONENT SPECIFICATIONS", margin, currentY);

  currentY += 4.5;

  // table column headers background
  doc.setFillColor(24, 24, 27);
  doc.rect(margin, currentY, contentWidth, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  const colComponentX = margin + 4;
  const colColorX = margin + 65;
  const colRoughnessX = margin + 115;
  const colMetalnessX = margin + 150;

  doc.text("COMPONENT", colComponentX, currentY + 4.8);
  doc.text("FINISH COLOR", colColorX, currentY + 4.8);
  doc.text("ROUGHNESS", colRoughnessX, currentY + 4.8);
  doc.text("METALNESS", colMetalnessX, currentY + 4.8);

  currentY += 7;

  // populate component specifications rows
  const { specs, extraDetails } = getModelSpecifications(modelKey);
  const rowHeight = 8.5;

  specs.forEach((spec, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 250, isEven ? 255 : 251);
    doc.setDrawColor(241, 243, 245);
    doc.rect(margin, currentY, contentWidth, rowHeight, "FD");

    // component label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text(spec.name, colComponentX, currentY + 5.5);

    // color swatch block
    const rgb = hexToRgb(spec.color);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(colColorX, currentY + 2, 4.5, 4.5, 0.8, 0.8, "FD");

    // hex color code
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(spec.color.toUpperCase(), colColorX + 7, currentY + 5.5);

    // roughness level
    const roughnessPercent = Math.round(spec.roughness * 100);
    const roughnessTag = roughnessPercent < 30 ? "Glossy" : roughnessPercent > 70 ? "Matte" : "Satin";
    doc.text(`${roughnessPercent}% (${roughnessTag})`, colRoughnessX, currentY + 5.5);

    // metalness level
    const metalnessPercent = Math.round(spec.metalness * 100);
    const metalnessTag = metalnessPercent > 50 ? "Metallic" : "Dielectric";
    doc.text(`${metalnessPercent}% (${metalnessTag})`, colMetalnessX, currentY + 5.5);

    currentY += rowHeight;
  });

  // optional extra details block
  if (extraDetails.length > 0) {
    currentY += 6;
    doc.setFillColor(244, 244, 245);
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(39, 39, 42);
    doc.text("ADDITIONAL STUDIO PARAMETERS", margin + 4, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(82, 82, 91);
    doc.text(extraDetails.join("   •   "), margin + 4, currentY + 10);

    currentY += 14;
  }

  // bottom footer metadata bar
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
  doc.text("PAGE 1 OF 1", pageWidth - margin, pageHeight - 10, {
    align: "right",
  });

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
