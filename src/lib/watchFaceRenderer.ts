export type WatchFaceStyle = "modular" | "wayfinder";

export type WatchFaceRenderOptions = {
  style: WatchFaceStyle;
  nightMode?: boolean;
};

// draw rounded rectangle path for squircle display border
function drawSquircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// draw circular progress ring with rounded line caps
function drawProgressRing(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
  progress: number,
  strokeColor: string,
  backgroundColor: string,
) {
  // background ring track
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = backgroundColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  if (progress <= 0) return;

  // active progress arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + Math.PI * 2 * Math.min(progress, 1);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();
}

// draw three concentric apple activity rings
function drawActivityRings(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  outerRadius: number,
  ringWidth: number,
  ringGap: number,
  nightMode: boolean,
) {
  const moveColor = nightMode ? "#ff2600" : "#fa114f";
  const exerciseColor = nightMode ? "#ff5b3a" : "#a1f62e";
  const standColor = nightMode ? "#ff8e75" : "#00f5d4";

  const moveBg = nightMode ? "rgba(255, 38, 0, 0.18)" : "rgba(250, 17, 79, 0.22)";
  const exerciseBg = nightMode ? "rgba(255, 38, 0, 0.18)" : "rgba(161, 246, 46, 0.22)";
  const standBg = nightMode ? "rgba(255, 38, 0, 0.18)" : "rgba(0, 245, 212, 0.22)";

  // outer move ring
  drawProgressRing(ctx, centerX, centerY, outerRadius, ringWidth, 0.78, moveColor, moveBg);

  // middle exercise ring
  const middleRadius = outerRadius - ringWidth - ringGap;
  drawProgressRing(ctx, centerX, centerY, middleRadius, ringWidth, 0.62, exerciseColor, exerciseBg);

  // inner stand ring
  const innerRadius = middleRadius - ringWidth - ringGap;
  drawProgressRing(ctx, centerX, centerY, innerRadius, ringWidth, 0.88, standColor, standBg);
}

// draw modular ultra official digital watch face
export function renderModularUltra(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  date: Date,
  nightMode: boolean = false,
) {
  const primaryColor = nightMode ? "#ff2600" : "#ffffff";
  const dimColor = nightMode ? "rgba(255, 38, 0, 0.45)" : "#8e8e93";
  const accentColor = nightMode ? "#ff2600" : "#ff5b00";
  const cardBg = nightMode ? "rgba(255, 38, 0, 0.08)" : "#141416";
  const cardBorder = nightMode ? "rgba(255, 38, 0, 0.25)" : "#232326";

  // clear background with pitch black oled surface
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  const minutes = date.getMinutes();
  const hours = date.getHours();

  // outer display border squircle
  ctx.lineWidth = 4;
  ctx.strokeStyle = nightMode ? "rgba(255, 38, 0, 0.35)" : "#1f1f22";
  drawSquircle(ctx, 36, 36, width - 72, height - 72, 130);
  ctx.stroke();

  // outer seconds bezel tick marks
  const totalTicks = 60;
  const centerX = width / 2;
  const centerY = height / 2;
  const outerBezelRadius = width / 2 - 58;

  for (let i = 0; i < totalTicks; i++) {
    const angle = (i / totalTicks) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const tickLen = isMajor ? 14 : 7;
    const x1 = centerX + Math.cos(angle) * (outerBezelRadius - tickLen);
    const y1 = centerY + Math.sin(angle) * (outerBezelRadius - tickLen);
    const x2 = centerX + Math.cos(angle) * outerBezelRadius;
    const y2 = centerY + Math.sin(angle) * outerBezelRadius;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    // highlight elapsed seconds along bezel
    if (i <= Math.floor(seconds)) {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = isMajor ? 4 : 2.5;
    } else {
      ctx.strokeStyle = dimColor;
      ctx.lineWidth = isMajor ? 2.5 : 1.5;
    }
    ctx.stroke();
  }

  // top left complication fitness runner
  const compTopY = 175;
  const compLeftX = 220;
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compLeftX, compTopY, 68, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawProgressRing(
    ctx,
    compLeftX,
    compTopY,
    58,
    7,
    0.72,
    nightMode ? "#ff2600" : "#30d158",
    nightMode ? "rgba(255, 38, 0, 0.2)" : "rgba(48, 209, 88, 0.2)",
  );

  // fitness runner silhouette
  ctx.fillStyle = nightMode ? "#ff2600" : "#30d158";
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RUN", compLeftX, compTopY);

  // top center date complication
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(`${dayName} ${dayNum}`, centerX, compTopY - 14);

  ctx.fillStyle = primaryColor;
  ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText(`${monthName} • 72° SUNNY`, centerX, compTopY + 18);

  // top right music complication
  const compRightX = width - 220;
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compRightX, compTopY, 68, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawProgressRing(
    ctx,
    compRightRight(),
    compTopY,
    58,
    7,
    0.55,
    nightMode ? "#ff2600" : "#fa114f",
    nightMode ? "rgba(255, 38, 0, 0.2)" : "rgba(250, 17, 79, 0.2)",
  );

  function compRightRight() {
    return compRightX;
  }

  // music note icon
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText("♫", compRightX, compTopY);

  // main digital time display
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(Math.floor(seconds)).padStart(2, "0");

  ctx.fillStyle = primaryColor;
  ctx.font = '700 210px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const timeY = 410;
  ctx.fillText(`${hoursStr}:${minutesStr}`, centerX - 25, timeY);

  // live seconds counter
  ctx.fillStyle = accentColor;
  ctx.font = '700 75px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText(secondsStr, centerX + 325, timeY - 20);

  // middle uvi elevation metrics container
  const barY = 575;
  const barWidth = width - 240;
  const barX = (width - barWidth) / 2;
  const barHeight = 84;

  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 1.5;
  drawSquircle(ctx, barX, barY, barWidth, barHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText("UVI 5 MODERATE", barX + 30, barY + 28);

  ctx.textAlign = "right";
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = dimColor;
  ctx.fillText("ELEV 1,480 FT", barX + barWidth - 30, barY + 28);

  // multi color gauge track
  const trackX = barX + 30;
  const trackY = barY + 54;
  const trackWidth = barWidth - 60;
  const trackHeight = 10;

  if (nightMode) {
    ctx.fillStyle = "rgba(255, 38, 0, 0.3)";
    ctx.fillRect(trackX, trackY, trackWidth, trackHeight);
    ctx.fillStyle = "#ff2600";
    ctx.fillRect(trackX, trackY, trackWidth * 0.6, trackHeight);
  } else {
    const gradient = ctx.createLinearGradient(trackX, trackY, trackX + trackWidth, trackY);
    gradient.addColorStop(0, "#30d158");
    gradient.addColorStop(0.35, "#ffd60a");
    gradient.addColorStop(0.7, "#ff9f0a");
    gradient.addColorStop(1, "#bf5af2");

    ctx.fillStyle = "#2c2c2e";
    ctx.beginPath();
    ctx.roundRect(trackX, trackY, trackWidth, trackHeight, 5);
    ctx.fill();

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(trackX, trackY, trackWidth * 0.65, trackHeight, 5);
    ctx.fill();
  }

  // bottom left complication battery status
  const compBottomY = 780;
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compLeftX, compBottomY, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawProgressRing(
    ctx,
    compLeftX,
    compBottomY,
    64,
    8,
    0.85,
    nightMode ? "#ff2600" : "#30d158",
    nightMode ? "rgba(255, 38, 0, 0.2)" : "rgba(48, 209, 88, 0.2)",
  );

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText("85%", compLeftX, compBottomY - 4);
  ctx.fillStyle = dimColor;
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText("BATTERY", compLeftX, compBottomY + 28);

  // bottom center compass complication
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, compBottomY, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText("315° NW", centerX, compBottomY - 6);
  ctx.fillStyle = dimColor;
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText("BEARING", centerX, compBottomY + 26);

  // bottom right official activity rings
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(compRightX, compBottomY, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawActivityRings(ctx, compRightX, compBottomY, 64, 8, 4, nightMode);
}

// draw wayfinder official analog watch face
export function renderWayfinder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  date: Date,
  nightMode: boolean = false,
) {
  const primaryColor = nightMode ? "#ff2600" : "#ffffff";
  const dimColor = nightMode ? "rgba(255, 38, 0, 0.45)" : "#8e8e93";
  const accentColor = nightMode ? "#ff2600" : "#ff5b00";
  const dialBg = nightMode ? "rgba(255, 38, 0, 0.05)" : "#0c0c0e";

  // clear background with pitch black oled surface
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  // outer display squircle border
  ctx.lineWidth = 4;
  ctx.strokeStyle = nightMode ? "rgba(255, 38, 0, 0.35)" : "#1f1f22";
  drawSquircle(ctx, 36, 36, width - 72, height - 72, 130);
  ctx.stroke();

  // outer compass bezel radius
  const compassRadius = 450;
  const dialRadius = 350;

  // circular inner dial background
  ctx.fillStyle = dialBg;
  ctx.beginPath();
  ctx.arc(centerX, centerY, dialRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = nightMode ? "rgba(255, 38, 0, 0.35)" : "#2a2a2e";
  ctx.stroke();

  // compass bezel ticks and degrees
  const totalCompassTicks = 120;
  for (let i = 0; i < totalCompassTicks; i++) {
    const angle = (i / totalCompassTicks) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 10 === 0;
    const isMedium = i % 5 === 0;
    const len = isMajor ? 16 : isMedium ? 10 : 6;

    const x1 = centerX + Math.cos(angle) * (compassRadius - len);
    const y1 = centerY + Math.sin(angle) * (compassRadius - len);
    const x2 = centerX + Math.cos(angle) * compassRadius;
    const y2 = centerY + Math.sin(angle) * compassRadius;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isMajor ? primaryColor : dimColor;
    ctx.lineWidth = isMajor ? 2.5 : 1.5;
    ctx.stroke();
  }

  // cardinal points and coordinates
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const cardinals = [
    { text: "N", angle: -Math.PI / 2, color: accentColor },
    { text: "E", angle: 0, color: primaryColor },
    { text: "S", angle: Math.PI / 2, color: primaryColor },
    { text: "W", angle: Math.PI, color: primaryColor },
  ];

  for (const c of cardinals) {
    const cx = centerX + Math.cos(c.angle) * 405;
    const cy = centerY + Math.sin(c.angle) * 405;
    ctx.fillStyle = c.color;
    ctx.fillText(c.text, cx, cy);
  }

  // coordinates readout on top and bottom
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = dimColor;
  ctx.fillText('37° 20\' 05" N', centerX, 68);
  ctx.fillText('122° 08\' 56" W', centerX, height - 68);

  // inner dial minute ticks
  const totalDialTicks = 60;
  for (let i = 0; i < totalDialTicks; i++) {
    const angle = (i / totalDialTicks) * Math.PI * 2 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const len = isHour ? 22 : 11;

    const x1 = centerX + Math.cos(angle) * (dialRadius - len);
    const y1 = centerY + Math.sin(angle) * (dialRadius - len);
    const x2 = centerX + Math.cos(angle) * dialRadius;
    const y2 = centerY + Math.sin(angle) * dialRadius;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isHour ? primaryColor : dimColor;
    ctx.lineWidth = isHour ? 4 : 2;
    ctx.stroke();
  }

  // hour numerals on dial
  const numerals = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const numeralRadius = dialRadius - 62;
  ctx.font = '700 42px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = primaryColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numerals.length; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const nx = centerX + Math.cos(angle) * numeralRadius;
    const ny = centerY + Math.sin(angle) * numeralRadius;
    ctx.fillText(String(numerals[i]), nx, ny);
  }

  // center crosshairs and compass grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = nightMode ? "rgba(255, 38, 0, 0.2)" : "rgba(255, 255, 255, 0.12)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX - 145, centerY);
  ctx.lineTo(centerX + 145, centerY);
  ctx.moveTo(centerX, centerY - 145);
  ctx.lineTo(centerX, centerY + 145);
  ctx.stroke();

  // corner complications
  // top left battery
  drawProgressRing(
    ctx,
    145,
    145,
    38,
    6,
    0.85,
    nightMode ? "#ff2600" : "#30d158",
    nightMode ? "rgba(255, 38, 0, 0.2)" : "rgba(48, 209, 88, 0.2)",
  );
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText("85%", 145, 145);

  // top right temperature
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText("72°", width - 145, 140);
  ctx.fillStyle = accentColor;
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText("FAIR", width - 145, 162);

  // bottom left date
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText(months[date.getMonth()], 145, height - 156);
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText(String(date.getDate()), 145, height - 132);

  // bottom right activity rings
  drawActivityRings(ctx, width - 145, height - 145, 38, 5, 2.5, nightMode);

  // time angle calculations for precision analog hands
  const ms = date.getMilliseconds();
  const s = date.getSeconds() + ms / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;

  const hourAngle = (h / 12) * Math.PI * 2 - Math.PI / 2;
  const minuteAngle = (m / 60) * Math.PI * 2 - Math.PI / 2;
  const secondAngle = (s / 60) * Math.PI * 2 - Math.PI / 2;

  // hour hand skeletonized baton
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(hourAngle);
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 12;

  const hourLen = 175;
  const hourWidth = 22;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(-25, -hourWidth / 2, hourLen, hourWidth, hourWidth / 2);
  ctx.fill();

  // inner hollow cutout
  ctx.fillStyle = nightMode ? "#2a0000" : "#0c0c0e";
  ctx.beginPath();
  ctx.roundRect(15, -hourWidth / 4, hourLen - 65, hourWidth / 2, hourWidth / 4);
  ctx.fill();
  ctx.restore();

  // minute hand skeletonized baton
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(minuteAngle);
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 14;

  const minLen = 270;
  const minWidth = 16;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(-25, -minWidth / 2, minLen, minWidth, minWidth / 2);
  ctx.fill();

  // inner hollow cutout
  ctx.fillStyle = nightMode ? "#2a0000" : "#0c0c0e";
  ctx.beginPath();
  ctx.roundRect(25, -minWidth / 4, minLen - 80, minWidth / 2, minWidth / 4);
  ctx.fill();
  ctx.restore();

  // sweeping international orange second hand
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(secondAngle);
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 8;

  const secLen = 330;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-55, 0);
  ctx.lineTo(secLen, 0);
  ctx.stroke();

  // counterweight circle at tail
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(-35, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // center pivot cap
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

