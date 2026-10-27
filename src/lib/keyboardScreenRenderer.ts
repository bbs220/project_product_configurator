import {
  KeyboardDisplayStyle,
  KeyboardDisplayTheme,
} from "@/stores/useConfiguratorStore";

export type KeyboardThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
};

// color palettes for keyboard oled display themes
export const KEYBOARD_THEME_PALETTES: Record<
  KeyboardDisplayTheme,
  KeyboardThemeColors
> = {
  amber: {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#fef3c7",
    glow: "rgba(245, 158, 11, 0.35)",
    surface: "rgba(30, 24, 18, 0.85)",
    border: "rgba(245, 158, 11, 0.45)",
    text: "#ffffff",
    muted: "#a1a1aa",
  },
  cyber: {
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#cffafe",
    glow: "rgba(6, 182, 212, 0.35)",
    surface: "rgba(8, 32, 45, 0.85)",
    border: "rgba(6, 182, 212, 0.45)",
    text: "#ffffff",
    muted: "#94a3b8",
  },
  matrix: {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#d1fae5",
    glow: "rgba(16, 185, 129, 0.35)",
    surface: "rgba(6, 38, 28, 0.85)",
    border: "rgba(16, 185, 129, 0.45)",
    text: "#ffffff",
    muted: "#94a3b8",
  },
  neon: {
    primary: "#c084fc",
    secondary: "#a855f7",
    accent: "#f3e8ff",
    glow: "rgba(192, 132, 252, 0.35)",
    surface: "rgba(38, 14, 56, 0.85)",
    border: "rgba(192, 132, 252, 0.45)",
    text: "#ffffff",
    muted: "#a1a1aa",
  },
  white: {
    primary: "#f4f4f5",
    secondary: "#a1a1aa",
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.3)",
    surface: "rgba(24, 24, 27, 0.85)",
    border: "rgba(244, 244, 245, 0.45)",
    text: "#ffffff",
    muted: "#71717a",
  },
};

// draw rotated block upright relative to user keyboard viewing angle
function withUpright(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  renderFn: () => void,
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(Math.PI);
  renderFn();
  ctx.restore();
}

// format hour to twelve hour display without leading zero
function formatTwelveHour(date: Date): { hours: string; minutes: string; seconds: string; ampm: string } {
  const rawHours = date.getHours();
  const rawMinutes = date.getMinutes();
  const rawSeconds = date.getSeconds();
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const hours12 = rawHours % 12 || 12;
  const hours = String(hours12);
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : String(rawMinutes);
  const seconds = rawSeconds < 10 ? `0${rawSeconds}` : String(rawSeconds);
  return { hours, minutes, seconds, ampm };
}

// short month names
const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

// short day names
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// draw rounded rectangle path
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

// render base pill screen boundary and background
export function drawScreenBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: KeyboardThemeColors,
) {
  ctx.fillStyle = "#030304";
  ctx.fillRect(0, 0, width, height);

  // draw outer pill boundary glow
  const pad = 8;
  const pillW = width - pad * 2;
  const pillH = height - pad * 2;
  const pillRadius = pillW / 2;

  ctx.save();
  drawRoundedRect(ctx, pad, pad, pillW, pillH, pillRadius);
  ctx.fillStyle = "#070709";
  ctx.fill();

  // subtle outer rim stroke
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.stroke();

  // subtle inner theme ambient vignette
  const grad = ctx.createLinearGradient(0, pad, 0, height - pad);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.02)");
  grad.addColorStop(0.5, theme.glow);
  grad.addColorStop(1, "rgba(0, 0, 0, 0.6)");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

// render primary digital clock and status card widget
export function renderClockCard(
  ctx: CanvasRenderingContext2D,
  date: Date,
  theme: KeyboardThemeColors,
) {
  // center of the clock widget squircle at front of keyboard
  const cx = 128;
  const cy = 870;
  const cardW = 208;
  const cardH = 220;

  withUpright(ctx, cx, cy, () => {
    // draw card background
    drawRoundedRect(
      ctx,
      -cardW / 2,
      -cardH / 2,
      cardW,
      cardH,
      24,
    );
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    // inner subtle highlight gradient
    const cardGrad = ctx.createLinearGradient(0, -cardH / 2, 0, cardH / 2);
    cardGrad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
    cardGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = cardGrad;
    ctx.fill();

    const { hours, minutes, seconds, ampm } = formatTwelveHour(date);
    const dayName = DAY_NAMES[date.getDay()];
    const monthName = MONTH_NAMES[date.getMonth()];
    const dayNum = date.getDate();

    // top header row with layer badge and battery
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("L0 // WIN", -cardW / 2 + 16, -cardH / 2 + 24);

    // battery icon and percent
    ctx.textAlign = "right";
    ctx.fillStyle = theme.accent;
    ctx.fillText("98% ⚡", cardW / 2 - 16, -cardH / 2 + 24);

    // separator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-cardW / 2 + 14, -cardH / 2 + 42);
    ctx.lineTo(cardW / 2 - 14, -cardH / 2 + 42);
    ctx.stroke();

    // large digital clock display
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.text;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 12;
    ctx.fillText(`${hours}:${minutes}`, -12, -2);
    ctx.shadowBlur = 0;

    // seconds and ampm stack
    ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.textAlign = "left";
    ctx.fillText(seconds, 58, -14);
    ctx.font = "600 12px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText(ampm, 58, 8);

    // bottom date badge banner
    drawRoundedRect(ctx, -cardW / 2 + 16, cardH / 2 - 44, cardW - 32, 28, 8);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.fillText(`${dayName}, ${monthName} ${dayNum}`, 0, cardH / 2 - 30);
  });
}

// render system hardware and keyboard telemetry mode
export function renderStatusMode(
  ctx: CanvasRenderingContext2D,
  timeSec: number,
  theme: KeyboardThemeColors,
) {
  const cx = 128;

  // top branding block
  withUpright(ctx, cx, 140, () => {
    drawRoundedRect(ctx, -90, -45, 180, 90, 16);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 8;
    ctx.fillText("KNOB 1", 0, -14);
    ctx.shadowBlur = 0;

    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText("PRO STUDIO // 2.4G", 0, 14);
  });

  // middle live performance wave and meters block
  withUpright(ctx, cx, 360, () => {
    const boxW = 200;
    const boxH = 260;

    drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 20);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    // header
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.fillText("SYSTEM TELEMETRY", -boxW / 2 + 16, -boxH / 2 + 22);

    // live animated wave line
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.primary;
    ctx.beginPath();
    const waveW = boxW - 32;
    const waveStartX = -waveW / 2;
    const waveY = -boxH / 2 + 65;

    for (let x = 0; x <= waveW; x += 4) {
      const freq = 0.05;
      const wave = Math.sin(x * freq + timeSec * 4) * Math.cos(x * 0.02 + timeSec * 2);
      const py = waveY + wave * 14;
      if (x === 0) ctx.moveTo(waveStartX + x, py);
      else ctx.lineTo(waveStartX + x, py);
    }
    ctx.stroke();

    // cpu usage meter
    const cpuPct = Math.round(48 + Math.sin(timeSec * 0.8) * 12);
    ctx.font = "600 12px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.text;
    ctx.fillText(`CPU USAGE: ${cpuPct}%`, -boxW / 2 + 16, -boxH / 2 + 115);

    drawRoundedRect(ctx, -boxW / 2 + 16, -boxH / 2 + 128, boxW - 32, 10, 5);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    drawRoundedRect(
      ctx,
      -boxW / 2 + 16,
      -boxH / 2 + 128,
      ((boxW - 32) * cpuPct) / 100,
      10,
      5,
    );
    ctx.fillStyle = theme.primary;
    ctx.fill();

    // ram memory meter
    const ramPct = 68;
    ctx.fillStyle = theme.text;
    ctx.fillText(`MEM USAGE: ${ramPct}%`, -boxW / 2 + 16, -boxH / 2 + 160);

    drawRoundedRect(ctx, -boxW / 2 + 16, -boxH / 2 + 173, boxW - 32, 10, 5);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    drawRoundedRect(
      ctx,
      -boxW / 2 + 16,
      -boxH / 2 + 173,
      ((boxW - 32) * ramPct) / 100,
      10,
      5,
    );
    ctx.fillStyle = theme.secondary;
    ctx.fill();

    // polling rate and temperature badges
    drawRoundedRect(ctx, -boxW / 2 + 16, -boxH / 2 + 205, 80, 26, 6);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.textAlign = "center";
    ctx.fillText("1000 HZ", -boxW / 2 + 56, -boxH / 2 + 218);

    drawRoundedRect(ctx, boxW / 2 - 96, -boxH / 2 + 205, 80, 26, 6);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.fillStyle = theme.primary;
    ctx.fillText("42°C // OK", boxW / 2 - 56, -boxH / 2 + 218);
  });

  // secondary status bar block
  withUpright(ctx, cx, 610, () => {
    drawRoundedRect(ctx, -95, -55, 190, 110, 16);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.fillText("ACTIVE PROFILE", 0, -28);

    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.fillText("CUSTOM // WORK", 0, -2);

    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText("RGB // N-KEY ROLLOVER", 0, 26);
  });
}

// render matrix cyber digital rain mode
export function renderMatrixMode(
  ctx: CanvasRenderingContext2D,
  timeSec: number,
  theme: KeyboardThemeColors,
) {
  const cx = 128;

  // matrix rain header card
  withUpright(ctx, cx, 130, () => {
    drawRoundedRect(ctx, -90, -40, 180, 80, 16);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 8;
    ctx.fillText("CYBER MATRIX", 0, -12);
    ctx.shadowBlur = 0;

    ctx.font = "600 11px monospace";
    ctx.fillStyle = theme.muted;
    ctx.fillText("STATUS // STREAMING", 0, 14);
  });

  // matrix falling character streams block
  withUpright(ctx, cx, 420, () => {
    const boxW = 200;
    const boxH = 430;

    drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 20);
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    // characters for matrix stream
    const glyphs = "01アイウエオカキクケコサシスセソタチツテトABCDEF";
    const cols = 9;
    const colSpacing = 20;

    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let c = 0; c < cols; c++) {
      const colX = -boxW / 2 + 18 + c * colSpacing;
      const speed = 1.2 + (c % 3) * 0.4;
      const offset = (c * 17) % 30;

      for (let r = 0; r < 20; r++) {
        const py = -boxH / 2 + 18 + r * 20;
        const phase = (timeSec * speed * 2 + offset + r) % glyphs.length;
        const char = glyphs[Math.floor(phase) % glyphs.length];

        // leading characters glow brighter
        const isHead = r === Math.floor((timeSec * speed * 3 + offset) % 20);
        if (isHead) {
          ctx.fillStyle = theme.accent;
          ctx.shadowColor = theme.accent;
          ctx.shadowBlur = 10;
        } else {
          const alpha = Math.max(0.2, (r % 6) / 6);
          ctx.fillStyle =
            theme.primary.replace(")", `, ${alpha})`).replace("rgb", "rgba");
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, colX, py);
      }
    }
    ctx.shadowBlur = 0;
  });
}

// render audio visualizer frequency spectrum mode
export function renderAudioMode(
  ctx: CanvasRenderingContext2D,
  timeSec: number,
  theme: KeyboardThemeColors,
) {
  const cx = 128;

  // audio header card
  withUpright(ctx, cx, 130, () => {
    drawRoundedRect(ctx, -90, -40, 180, 80, 16);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 8;
    ctx.fillText("AUDIO SPECTRUM", 0, -12);
    ctx.shadowBlur = 0;

    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText("LIVE EQ // VISUALIZER", 0, 14);
  });

  // equalizer graphic bars block
  withUpright(ctx, cx, 420, () => {
    const boxW = 200;
    const boxH = 430;

    drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 20);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    // title row
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.fillText("GRAPHIC EQUALIZER", -boxW / 2 + 16, -boxH / 2 + 24);

    ctx.textAlign = "right";
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.fillText("96 KHZ", boxW / 2 - 16, -boxH / 2 + 24);

    // animated frequency bars
    const barCount = 14;
    const barSpacing = (boxW - 32) / barCount;
    const barW = barSpacing - 3;
    const maxBarH = 220;
    const baseY = boxH / 2 - 70;

    for (let i = 0; i < barCount; i++) {
      const bx = -boxW / 2 + 16 + i * barSpacing;
      // organic audio frequency formula
      const waveA = Math.sin(timeSec * 5 + i * 0.8) * 0.5 + 0.5;
      const waveB = Math.cos(timeSec * 3 + i * 0.4) * 0.3 + 0.3;
      const waveC = Math.sin(timeSec * 8 + i * 1.5) * 0.2 + 0.2;
      const heightFrac = Math.max(0.1, Math.min(1.0, waveA * 0.5 + waveB + waveC));
      const barH = heightFrac * maxBarH;

      // draw background track
      drawRoundedRect(ctx, bx, baseY - maxBarH, barW, maxBarH, 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fill();

      // draw active level gradient
      const grad = ctx.createLinearGradient(0, baseY, 0, baseY - barH);
      grad.addColorStop(0, theme.secondary);
      grad.addColorStop(0.7, theme.primary);
      grad.addColorStop(1, theme.accent);

      drawRoundedRect(ctx, bx, baseY - barH, barW, barH, 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // peak hold dot
      const peakY = baseY - Math.min(maxBarH, barH + 8);
      drawRoundedRect(ctx, bx, peakY - 3, barW, 2, 1);
      ctx.fillStyle = theme.accent;
      ctx.fill();
    }

    // stereo vu meters at bottom
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.textAlign = "left";
    ctx.fillText("CH-L", -boxW / 2 + 16, boxH / 2 - 42);
    ctx.fillText("CH-R", -boxW / 2 + 16, boxH / 2 - 20);

    const vuW = boxW - 74;
    const vuLeft = Math.round(vuW * (0.6 + Math.sin(timeSec * 6) * 0.3));
    const vuRight = Math.round(vuW * (0.65 + Math.cos(timeSec * 5) * 0.25));

    drawRoundedRect(ctx, -boxW / 2 + 58, boxH / 2 - 48, vuW, 8, 4);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    drawRoundedRect(ctx, -boxW / 2 + 58, boxH / 2 - 48, vuLeft, 8, 4);
    ctx.fillStyle = theme.primary;
    ctx.fill();

    drawRoundedRect(ctx, -boxW / 2 + 58, boxH / 2 - 26, vuW, 8, 4);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    drawRoundedRect(ctx, -boxW / 2 + 58, boxH / 2 - 26, vuRight, 8, 4);
    ctx.fillStyle = theme.secondary;
    ctx.fill();
  });
}

// render retro pixel companion mascot mode
export function renderRetroMode(
  ctx: CanvasRenderingContext2D,
  timeSec: number,
  theme: KeyboardThemeColors,
) {
  const cx = 128;

  // retro companion header
  withUpright(ctx, cx, 130, () => {
    drawRoundedRect(ctx, -90, -40, 180, 80, 16);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 8;
    ctx.fillText("RETRO COMPANION", 0, -12);
    ctx.shadowBlur = 0;

    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText("PIXEL ART // TYPING", 0, 14);
  });

  // pixel companion animation block
  withUpright(ctx, cx, 420, () => {
    const boxW = 200;
    const boxH = 430;

    drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 20);
    ctx.fillStyle = theme.surface;
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    // animated pixel cat mascot
    const bounce = Math.sin(timeSec * 6) * 6;
    const catY = -boxH / 2 + 110 + bounce;

    // pixel grid size
    const pSize = 7;
    // pixel art cat face matrix
    const catMap = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];

    const startPx = -((12 * pSize) / 2);
    const startPy = catY - (10 * pSize) / 2;

    for (let r = 0; r < catMap.length; r++) {
      for (let c = 0; c < catMap[r].length; c++) {
        if (catMap[r][c] === 1) {
          ctx.fillStyle = theme.primary;
          ctx.fillRect(startPx + c * pSize, startPy + r * pSize, pSize - 1, pSize - 1);
        }
      }
    }

    // typing paws animation
    const leftPawY = catY + 45 + Math.sin(timeSec * 12) * 5;
    const rightPawY = catY + 45 - Math.sin(timeSec * 12) * 5;

    ctx.fillStyle = theme.accent;
    ctx.fillRect(-28, leftPawY, 18, 12);
    ctx.fillRect(10, rightPawY, 18, 12);

    // companion mood speech bubble
    drawRoundedRect(ctx, -70, catY + 75, 140, 28, 8);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px monospace";
    ctx.fillStyle = theme.accent;
    ctx.fillText("KEEP TYPING!", 0, catY + 89);

    // live typing speed wpm gauge
    const wpm = Math.round(92 + Math.sin(timeSec * 0.5) * 16);
    drawRoundedRect(ctx, -boxW / 2 + 16, boxH / 2 - 95, boxW - 32, 75, 12);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.muted;
    ctx.fillText("SPEED PERFORMANCE", 0, boxH / 2 - 80);

    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.primary;
    ctx.fillText(`${wpm} WPM`, 0, boxH / 2 - 52);

    ctx.font = "600 11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = theme.accent;
    ctx.fillText("RANK // S-TIER", 0, boxH / 2 - 32);
  });
}

// master draw function for keyboard oled display screen
export function renderKeyboardScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: KeyboardDisplayStyle,
  themeKey: KeyboardDisplayTheme,
  date: Date,
  timeSec: number,
) {
  const theme = KEYBOARD_THEME_PALETTES[themeKey] || KEYBOARD_THEME_PALETTES.amber;

  // draw base background pill frame
  drawScreenBackground(ctx, width, height, theme);

  // draw primary style-specific content
  switch (style) {
    case "matrix":
      renderMatrixMode(ctx, timeSec, theme);
      break;
    case "audio":
      renderAudioMode(ctx, timeSec, theme);
      break;
    case "retro":
      renderRetroMode(ctx, timeSec, theme);
      break;
    case "status":
    default:
      renderStatusMode(ctx, timeSec, theme);
      break;
  }

  // render bottom clock and status card widget
  renderClockCard(ctx, date, theme);
}
