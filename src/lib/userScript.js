// ==UserScript==
// @name         Sketchfab Model/Textures Ripper V6 (SEP_2026)
// @namespace    local.sketchfab.ripper
// @version      1.1.1
// @description  Captures rendered Sketchfab geometry and textures with safer patching and diagnostics.
// @author       Original (Risk) Fixed by Tavteh
// @match        https://sketchfab.com/*
// @match        https://www.sketchfab.com/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(() => {
  "use strict";

  const page = unsafeWindow;
  const LOG_PREFIX = "[Sketchfab Ripper]";
  const MAX_TEXTURE_PIXELS = 8192 * 8192;
  const OBJ_CHUNK_LINES = 12000;
  const TEXTURE_WAIT_MS = 6000;
  const MIN_GPU_TEXTURE_SIZE = 256;
  const WEBGL_HOOK_MARK = Symbol("sfrWebGLHook");

  const state = {
    models: [],
    seenModels: new WeakSet(),
    wantedTextures: new Map(),
    capturedTextureUrls: new Set(),
    usedFilenames: new Set(),
    files: new Map(),
    pendingBlobs: new Set(),
    button: null,
    patchedScripts: new Set(),
    patchCount: 0,
    gpuTextures: new Map(),
    gpuContextState: new WeakMap(),
    textureNamesByUid: new Map(),
    textureRolesByUid: new Map(),
    textureRolesByUrl: new Map(),
    textureManifest: [],
    nextGpuTextureId: 1,
    hookedWebGLPrototypes: new WeakSet(),
  };

  const log = (...args) => console.log(LOG_PREFIX, ...args);
  const warn = (...args) => console.warn(LOG_PREFIX, ...args);

  function safeArray(value) {
    if (!value) return [];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) return value;
    return [];
  }

  function sanitizeFilename(value, fallback = "sketchfab-model") {
    const cleaned = String(value || fallback)
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
      .replace(/[. ]+$/g, "")
      .trim();
    return (cleaned || fallback).slice(0, 140);
  }

  function normalizeUrl(value) {
    if (!value) return "";
    try {
      return new URL(value, location.href).href;
    } catch {
      return String(value || "");
    }
  }

  function uniqueFilename(name) {
    const clean = sanitizeFilename(name, "texture.png");
    if (!state.usedFilenames.has(clean)) {
      state.usedFilenames.add(clean);
      return clean;
    }

    const dot = clean.lastIndexOf(".");
    const base = dot > 0 ? clean.slice(0, dot) : clean;
    const ext = dot > 0 ? clean.slice(dot) : "";
    let index = 2;
    while (state.usedFilenames.has(`${base}-${index}${ext}`)) index += 1;
    const unique = `${base}-${index}${ext}`;
    state.usedFilenames.add(unique);
    return unique;
  }

  const textureRolePatterns = [
    [
      "normal",
      /(?:normal(?:map)?|(?:^|[^a-z0-9])nrm(?:[^a-z0-9]|$)|(?:^|[^a-z0-9])nor(?:[^a-z0-9]|$))/i,
    ],
    ["roughness", /(?:roughness|rough|roughnesspbr)/i],
    ["metallic", /(?:metallic|metalness|metalnesspbr)/i],
    [
      "ao",
      /(?:ambient[\s_.-]*occlusion|occlusion|(?:^|[^a-z0-9])ao(?:[^a-z0-9]|$))/i,
    ],
    ["emissive", /(?:emissive|emission|emitcolor|self[\s_.-]*illum)/i],
    [
      "opacity",
      /(?:opacity|transparent|transparency|alpha[\s_.-]*(?:map|mask)|cutout)/i,
    ],
    [
      "specular",
      /(?:specular|specularpbr|(?:^|[^a-z0-9])spec(?:[^a-z0-9]|$))/i,
    ],
    ["glossiness", /(?:glossiness|gloss)/i],
    [
      "height",
      /(?:height|displacement|bumpmap|(?:^|[^a-z0-9])bump(?:[^a-z0-9]|$))/i,
    ],
    [
      "diffuse",
      /(?:diffuse|albedo|base[\s_.-]*color|basecolor|diffusepbr|colorpbr)/i,
    ],
    ["clearcoat", /(?:clear[\s_.-]*coat|clearcoat)/i],
    ["sheen", /(?:sheen)/i],
    ["transmission", /(?:transmission|translucency)/i],
  ];

  function detectTextureRole(...hints) {
    const text = hints.filter(Boolean).map(String).join(" ");
    for (const [role, pattern] of textureRolePatterns) {
      if (pattern.test(text)) return role;
    }
    return "";
  }

  function findUidInUrl(url) {
    try {
      const segments = new URL(normalizeUrl(url)).pathname
        .split("/")
        .filter(Boolean);
      return (
        segments.find((segment) => state.textureNamesByUid.has(segment)) || ""
      );
    } catch {
      return "";
    }
  }

  function getTextureRole(url, ...hints) {
    const normalized = normalizeUrl(url);
    const direct = state.textureRolesByUrl.get(normalized);
    if (direct) return direct;
    const uid = findUidInUrl(normalized);
    return (
      state.textureRolesByUid.get(uid) ||
      detectTextureRole(...hints, normalized)
    );
  }

  function looksGeneratedTextureName(value) {
    const compact = value.replace(/[^a-z0-9]/gi, "");
    return (
      /^(?:texturegpu|texture)\d+$/i.test(compact) ||
      (/^[a-f0-9]+$/i.test(compact) && compact.length >= 16)
    );
  }

  function buildTextureFilename(nameHint, url, fallback, ...roleHints) {
    const inferred = sanitizeFilename(
      nameHint || inferTextureName(url, fallback),
      fallback,
    );
    let base = inferred.replace(/\.(png|jpe?g|webp|avif|tga|bmp)$/i, "");
    const role = getTextureRole(url, inferred, ...roleHints);

    if (role) {
      const roleAlreadyPresent = detectTextureRole(base) === role;
      if (looksGeneratedTextureName(base)) base = role;
      else if (!roleAlreadyPresent) base = `${role}-${base}`;
    }
    return uniqueFilename(`${base}.png`);
  }

  function inferTextureName(url, fallback) {
    const normalized = normalizeUrl(url);
    const direct = state.wantedTextures.get(normalized);
    if (direct) return direct;

    try {
      const segments = new URL(normalized).pathname.split("/").filter(Boolean);
      for (const segment of segments) {
        const known = state.textureNamesByUid.get(segment);
        if (known) return known;
      }
      const last = decodeURIComponent(segments.at(-1) || "");
      if (last && last.includes(".")) return last;
    } catch {
      /* use fallback */
    }
    return fallback;
  }

  function readTextureCatalog() {
    try {
      const node = document.querySelector("#js-dom-data-prefetched-data");
      if (!node) return;
      const source = node.textContent
        .replace(/^\s*<!--/, "")
        .replace(/-->\s*$/, "")
        .replaceAll("&#34;", '"');
      const prefetched = JSON.parse(source);
      const payload = Object.entries(prefetched).find(([key]) =>
        key.includes("/textures?optimized=1"),
      )?.[1];
      const textures = safeArray(payload?.results);

      for (const texture of textures) {
        const name = sanitizeFilename(
          texture?.name,
          `texture-${state.textureNamesByUid.size + 1}`,
        );
        const role = detectTextureRole(
          texture?.name,
          texture?.type,
          texture?.channel,
          texture?.slot,
          texture?.usage,
          texture?.semantic,
          texture?.label,
        );
        if (texture?.uid) {
          const uid = String(texture.uid);
          state.textureNamesByUid.set(uid, name);
          if (role) state.textureRolesByUid.set(uid, role);
        }
        for (const image of safeArray(texture?.images)) {
          const url = normalizeUrl(image?.url);
          if (url) {
            state.wantedTextures.set(url, name);
            if (role) state.textureRolesByUrl.set(url, role);
          }
        }
      }
      if (textures.length) log("Texture catalog loaded:", textures.length);
    } catch (error) {
      warn("Texture catalog unreadable:", error);
    }
  }

  function parseTexImage2DArgs(args) {
    if (args.length === 6) {
      const [target, level, internalFormat, format, type, source] = args;
      return {
        target,
        level,
        internalFormat,
        format,
        type,
        width:
          Number(source?.videoWidth || source?.naturalWidth || source?.width) ||
          0,
        height:
          Number(
            source?.videoHeight || source?.naturalHeight || source?.height,
          ) || 0,
        sourceUrl: normalizeUrl(source?.currentSrc || source?.src),
      };
    }
    if (args.length === 9) {
      const [target, level, internalFormat, width, height, , format, type] =
        args;
      return {
        target,
        level,
        internalFormat,
        format,
        type,
        width: Number(width) || 0,
        height: Number(height) || 0,
        sourceUrl: "",
      };
    }
    return null;
  }

  function getGpuRecord(gl, texture, nativeDelete) {
    if (!texture) return null;
    let record = state.gpuTextures.get(texture);
    if (!record) {
      record = {
        id: state.nextGpuTextureId++,
        texture,
        gl,
        nativeDelete,
        width: 0,
        height: 0,
        level: 0,
        target: gl.TEXTURE_2D,
        sourceUrl: "",
        linkedSourceUrl: "",
        role: "",
        deleteRequested: false,
      };
      state.gpuTextures.set(texture, record);
    }
    return record;
  }

  function isEligibleGpuTexture(record) {
    return (
      record &&
      record.level === 0 &&
      record.target === record.gl.TEXTURE_2D &&
      record.width >= MIN_GPU_TEXTURE_SIZE &&
      record.height >= MIN_GPU_TEXTURE_SIZE &&
      record.width * record.height <= MAX_TEXTURE_PIXELS
    );
  }

  function installWebGLHook(ContextConstructor) {
    const prototype = ContextConstructor?.prototype;
    if (!prototype || state.hookedWebGLPrototypes.has(prototype)) return;
    if (prototype.createTexture?.[WEBGL_HOOK_MARK]) return;
    state.hookedWebGLPrototypes.add(prototype);

    const nativeCreateTexture = prototype.createTexture;
    const nativeDeleteTexture = prototype.deleteTexture;
    const nativeTexImage2D = prototype.texImage2D;
    if (
      ![nativeCreateTexture, nativeDeleteTexture, nativeTexImage2D].every(
        (method) => typeof method === "function",
      )
    )
      return;

    prototype.createTexture = function createTextureHook(...args) {
      const texture = nativeCreateTexture.apply(this, args);
      getGpuRecord(this, texture, nativeDeleteTexture);
      return texture;
    };
    prototype.createTexture[WEBGL_HOOK_MARK] = true;

    prototype.texImage2D = function texImage2DHook(...args) {
      const result = nativeTexImage2D.apply(this, args);
      try {
        const parsed = parseTexImage2DArgs(args);
        if (!parsed || parsed.target !== this.TEXTURE_2D) return result;
        const texture = this.getParameter(this.TEXTURE_BINDING_2D);
        const record = getGpuRecord(this, texture, nativeDeleteTexture);
        if (!record) return result;

        Object.assign(record, parsed);
        if (isEligibleGpuTexture(record)) {
          if (record.sourceUrl) record.role = getTextureRole(record.sourceUrl);
          let contextState = state.gpuContextState.get(this);
          if (!contextState) {
            contextState = { lastEligible: null };
            state.gpuContextState.set(this, contextState);
          }
          if (
            record.sourceUrl &&
            contextState.lastEligible &&
            contextState.lastEligible !== record &&
            !contextState.lastEligible.sourceUrl
          ) {
            contextState.lastEligible.linkedSourceUrl = record.sourceUrl;
            contextState.lastEligible.role = record.role;
          }
          contextState.lastEligible = record;
        }
      } catch (error) {
        warn("texImage2D registration failed:", error);
      }
      return result;
    };
    prototype.texImage2D[WEBGL_HOOK_MARK] = true;

    prototype.deleteTexture = function deleteTextureHook(texture) {
      const record = state.gpuTextures.get(texture);
      if (isEligibleGpuTexture(record)) {
        record.deleteRequested = true;
        return;
      }
      return nativeDeleteTexture.call(this, texture);
    };
    prototype.deleteTexture[WEBGL_HOOK_MARK] = true;

    log("Intercettazione WebGL texture attiva:", ContextConstructor.name);
  }

  function updateButton() {
    if (!state.button) return;
    state.button.textContent = `DOWNLOAD (${state.models.length})`;
    state.button.title = state.models.length
      ? "Export captured geometries"
      : "No geometry captured: wait for the model to fully load";
  }

  function mountButton() {
    if (state.button?.isConnected || !document.documentElement) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = "sfr-download-button";
    button.textContent = "DOWNLOAD (0)";
    button.title = "Wait for the model to fully load";
    Object.assign(button.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      zIndex: "2147483647",
      padding: "9px 13px",
      border: "1px solid #ff5a5f",
      borderRadius: "5px",
      background: "#171717",
      color: "#ff6b6f",
      font: "600 12px/1.2 sans-serif",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,.35)",
    });
    button.addEventListener("click", downloadArchive);

    (document.body || document.documentElement).appendChild(button);
    state.button = button;
    updateButton();
  }

  function getPageTitle() {
    const selectors = [
      ".model-name__label",
      '[data-testid="model-name"]',
      "h1",
    ];
    for (const selector of selectors) {
      const text = document.querySelector(selector)?.textContent?.trim();
      if (text) return sanitizeFilename(text);
    }
    return sanitizeFilename(
      document.title.replace(/\s*[|-]\s*Sketchfab.*$/i, ""),
    );
  }

  function parseGeometry(geometry) {
    const attributes = geometry?._attributes;
    const vertices = safeArray(attributes?.Vertex?._elements);
    if (!vertices.length) return null;

    const uvKeys = [
      "TexCoord0",
      "TexCoord1",
      "TexCoord2",
      "TexCoord3",
      "TexCoord4",
      "TexCoord5",
      "TexCoord6",
      "TexCoord7",
      "TexCoord8",
    ];
    const uvAttribute = uvKeys.map((key) => attributes?.[key]).find(Boolean);
    const primitives = safeArray(geometry?._primitives)
      .map((primitive) => ({
        mode: primitive?.mode,
        indices: safeArray(primitive?.indices?._elements),
      }))
      .filter((primitive) => primitive.indices.length > 0);

    if (!primitives.length) return null;
    return {
      vertices,
      normals: safeArray(attributes?.Normal?._elements),
      uvs: safeArray(uvAttribute?._elements),
      primitives,
    };
  }

  function makeFace(indices, hasUvs, hasNormals) {
    const refs = indices.map((rawIndex) => {
      const index = Number(rawIndex) + 1;
      if (hasUvs && hasNormals) return `${index}/${index}/${index}`;
      if (hasUvs) return `${index}/${index}`;
      if (hasNormals) return `${index}//${index}`;
      return String(index);
    });
    return `f ${refs.join(" ")}`;
  }

  function yieldToBrowser() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function geometryToObjBlob(parsed, name) {
    const chunks = [];
    let lines = [
      `# Exported by Sketchfab Model Ripper robust edition`,
      `o ${name}`,
    ];

    async function flushIfNeeded(force = false) {
      if (!force && lines.length < OBJ_CHUNK_LINES) return;
      if (lines.length) chunks.push(`${lines.join("\n")}\n`);
      lines = [];
      await yieldToBrowser();
    }

    for (let i = 0; i + 2 < parsed.vertices.length; i += 3) {
      lines.push(
        `v ${parsed.vertices[i]} ${parsed.vertices[i + 1]} ${parsed.vertices[i + 2]}`,
      );
      if (lines.length >= OBJ_CHUNK_LINES) await flushIfNeeded();
    }
    for (let i = 0; i + 2 < parsed.normals.length; i += 3) {
      lines.push(
        `vn ${parsed.normals[i]} ${parsed.normals[i + 1]} ${parsed.normals[i + 2]}`,
      );
      if (lines.length >= OBJ_CHUNK_LINES) await flushIfNeeded();
    }
    for (let i = 0; i + 1 < parsed.uvs.length; i += 2) {
      lines.push(`vt ${parsed.uvs[i]} ${parsed.uvs[i + 1]}`);
      if (lines.length >= OBJ_CHUNK_LINES) await flushIfNeeded();
    }

    lines.push("s on");
    const hasUvs = parsed.uvs.length > 0;
    const hasNormals = parsed.normals.length > 0;

    for (const primitive of parsed.primitives) {
      if (primitive.mode === 4) {
        for (let i = 0; i + 2 < primitive.indices.length; i += 3) {
          lines.push(
            makeFace(
              [
                primitive.indices[i],
                primitive.indices[i + 1],
                primitive.indices[i + 2],
              ],
              hasUvs,
              hasNormals,
            ),
          );
          if (lines.length >= OBJ_CHUNK_LINES) await flushIfNeeded();
        }
      } else if (primitive.mode === 5) {
        for (let i = 0; i + 2 < primitive.indices.length; i += 1) {
          const triangle =
            i % 2
              ? [
                  primitive.indices[i],
                  primitive.indices[i + 2],
                  primitive.indices[i + 1],
                ]
              : [
                  primitive.indices[i],
                  primitive.indices[i + 1],
                  primitive.indices[i + 2],
                ];
          if (
            triangle[0] !== triangle[1] &&
            triangle[1] !== triangle[2] &&
            triangle[0] !== triangle[2]
          ) {
            lines.push(makeFace(triangle, hasUvs, hasNormals));
            if (lines.length >= OBJ_CHUNK_LINES) await flushIfNeeded();
          }
        }
      } else {
        warn("Unsupported primitive mode:", primitive.mode);
      }
    }

    lines.push("");
    await flushIfNeeded(true);
    return new Blob(chunks, { type: "text/plain;charset=utf-8" });
  }

  function flipRgbaRows(pixels, width, height) {
    const rowSize = width * 4;
    const row = new Uint8Array(rowSize);
    for (let y = 0; y < Math.floor(height / 2); y += 1) {
      const top = y * rowSize;
      const bottom = (height - y - 1) * rowSize;
      row.set(pixels.subarray(top, top + rowSize));
      pixels.copyWithin(top, bottom, bottom + rowSize);
      pixels.set(row, bottom);
    }
  }

  function rgbaToPngBlob(pixels, width, height) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(null);
        return;
      }

      const imageData = context.createImageData(width, height);
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);

      let settled = false;
      const finish = (blob) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve(blob || null);
      };
      const timeoutId = setTimeout(() => finish(null), TEXTURE_WAIT_MS);
      try {
        canvas.toBlob(finish, "image/png");
      } catch {
        finish(null);
      }
    });
  }

  async function captureGpuTexture(record) {
    const sourceUrl = record.linkedSourceUrl || record.sourceUrl;
    if (
      !sourceUrl ||
      state.capturedTextureUrls.has(sourceUrl) ||
      !isEligibleGpuTexture(record)
    )
      return false;

    const gl = record.gl;
    if (gl.isContextLost?.()) return false;
    const previousFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) return false;

    try {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        record.texture,
        0,
      );
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        return false;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (gl.getError() === gl.NO_ERROR) break;
      }
      const pixels = new Uint8Array(record.width * record.height * 4);
      gl.readPixels(
        0,
        0,
        record.width,
        record.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      if (gl.getError() !== gl.NO_ERROR) return false;

      flipRgbaRows(pixels, record.width, record.height);
      const blob = await rgbaToPngBlob(pixels, record.width, record.height);
      if (!blob) return false;

      const inferred = inferTextureName(sourceUrl, `texture-gpu-${record.id}`);
      const filename = buildTextureFilename(
        inferred,
        sourceUrl,
        `texture-gpu-${record.id}`,
        record.role,
      );
      state.files.set(filename, blob);
      state.textureManifest.push({
        file: filename,
        originalName: inferred,
        role: getTextureRole(sourceUrl, inferred, record.role) || null,
        width: record.width,
        height: record.height,
        capturedBy: "webgl",
      });
      state.capturedTextureUrls.add(sourceUrl);
      return true;
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER, previousFramebuffer);
      gl.deleteFramebuffer(framebuffer);
    }
  }

  async function captureTrackedGpuTextures() {
    const candidates = [...state.gpuTextures.values()].filter(
      (record) =>
        isEligibleGpuTexture(record) &&
        (record.linkedSourceUrl || record.sourceUrl),
    );
    let captured = 0;

    try {
      for (let index = 0; index < candidates.length; index += 1) {
        state.button.textContent = `GPU ${index + 1}/${candidates.length}`;
        try {
          if (await captureGpuTexture(candidates[index])) captured += 1;
        } catch (error) {
          warn("GPU texture read failed:", error);
        }
        await yieldToBrowser();
      }
    } finally {
      for (const [texture, record] of state.gpuTextures) {
        if (!record.deleteRequested) continue;
        try {
          record.nativeDelete.call(record.gl, texture);
        } catch {
          /* context disposed */
        }
        state.gpuTextures.delete(texture);
      }
    }

    if (captured) log("WebGL textures added to ZIP:", captured);
  }

  async function waitForPendingTextures() {
    const pending = [...state.pendingBlobs];
    if (!pending.length) return;

    let timeoutId;
    const timeout = new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve("timeout"), TEXTURE_WAIT_MS);
    });
    const result = await Promise.race([
      Promise.allSettled(pending).then(() => "complete"),
      timeout,
    ]);
    clearTimeout(timeoutId);
    if (result === "timeout")
      warn("Maximum texture wait time reached; continuing with available files.");
  }

  function isBlobLike(data) {
    return (
      data &&
      typeof data.size === "number" &&
      typeof data.arrayBuffer === "function"
    );
  }

  function entrySize(data) {
    if (isBlobLike(data)) return data.size;
    if (data instanceof Uint8Array) return data.byteLength;
    return new TextEncoder().encode(String(data)).byteLength;
  }

  async function pushEntryData(target, data, reportBytes) {
    if (typeof data === "string") {
      const bytes = new TextEncoder().encode(data);
      target.push(bytes, true);
      reportBytes(bytes.byteLength);
      return;
    }

    if (data instanceof Uint8Array) {
      target.push(data, true);
      reportBytes(data.byteLength);
      return;
    }

    if (!isBlobLike(data))
      throw new TypeError("Unsupported ZIP file type");

    if (typeof data.stream === "function") {
      const reader = data.stream().getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        target.push(value, false);
        reportBytes(value.byteLength);
        await yieldToBrowser();
      }
      target.push(new Uint8Array(0), true);
      return;
    }

    const bytes = new Uint8Array(await data.arrayBuffer());
    target.push(bytes, true);
    reportBytes(bytes.byteLength);
  }

  async function createZipBlob(entries, onProgress) {
    const outputChunks = [];
    const totalBytes = Math.max(
      1,
      entries.reduce((sum, entry) => sum + entrySize(entry.data), 0),
    );
    let processedBytes = 0;
    let lastPercent = -1;
    let settled = false;
    let resolveArchive;
    let rejectArchive;

    const result = new Promise((resolve, reject) => {
      resolveArchive = resolve;
      rejectArchive = reject;
    });

    const archive = new fflate.Zip((error, chunk, final) => {
      if (settled) return;
      if (error) {
        settled = true;
        rejectArchive(error);
        return;
      }
      if (chunk?.length) outputChunks.push(chunk);
      if (final) {
        settled = true;
        onProgress(100);
        resolveArchive(new Blob(outputChunks, { type: "application/zip" }));
      }
    });

    const reportBytes = (count) => {
      processedBytes += count;
      const percent = Math.min(
        99,
        Math.floor((processedBytes / totalBytes) * 100),
      );
      if (percent !== lastPercent) {
        lastPercent = percent;
        onProgress(percent);
      }
    };

    try {
      for (const entry of entries) {
        const zipEntry = new fflate.ZipPassThrough(entry.name);
        archive.add(zipEntry);
        await pushEntryData(zipEntry, entry.data, reportBytes);
      }
      archive.end();
    } catch (error) {
      if (!settled) {
        settled = true;
        try {
          archive.terminate();
        } catch {
          /* already stopped */
        }
        rejectArchive(error);
      }
    }

    return result;
  }

  async function downloadArchive() {
    if (!state.models.length) {
      alert(
        "No geometry captured. Wait for the model to be fully visible. If the counter stays at zero, the Sketchfab bundle has changed and the hooks need to be updated.",
      );
      return;
    }

    state.button.disabled = true;
    state.button.textContent = "PREPARING...";

    try {
      state.button.textContent = "GPU...";
      await captureTrackedGpuTextures();

      state.button.textContent = "TEXTURES...";
      await waitForPendingTextures();

      const entries = [];
      let exportedModels = 0;
      for (let index = 0; index < state.models.length; index += 1) {
        state.button.textContent = `OBJ ${index + 1}/${state.models.length}`;
        const geometry = state.models[index];
        const name = `model_${index}`;
        const parsed = parseGeometry(geometry);
        if (parsed) {
          entries.push({
            name: `collection/${name}.obj`,
            data: await geometryToObjBlob(parsed, name),
          });
          exportedModels += 1;
        }
      }

      if (!exportedModels)
        throw new Error(
          "Captured geometries are no longer readable. Reload the page and try again.",
        );

      for (const [name, value] of state.files) {
        entries.push({ name: `collection/${name}`, data: value });
      }
      if (state.textureManifest.length) {
        entries.push({
          name: "collection/texture-manifest.json",
          data: JSON.stringify(state.textureManifest, null, 2),
        });
      }
      entries.push({
        name: "collection/README.txt",
        data: [
          "OBJ geometry and separately captured PNG textures.",
          "Material assignments cannot be reconstructed reliably from this rendering hook.",
          "Script fixed by TAVTEH follow me on GIT",
          `Captured geometries: ${state.models.length}`,
          `Captured textures: ${state.files.size}`,
        ].join("\n"),
      });

      state.button.textContent = "ZIP 0%";
      const blob = await createZipBlob(entries, (percent) => {
        state.button.textContent = `ZIP ${percent}%`;
      });
      saveAs(blob, `${getPageTitle()}.zip`);
    } catch (error) {
      console.error(LOG_PREFIX, error);
      alert(`Export failed: ${error?.message || error}`);
    } finally {
      state.button.disabled = false;
      updateButton();
    }
  }

  page.attachbody = function attachBody(geometry) {
    if (
      !geometry ||
      typeof geometry !== "object" ||
      state.seenModels.has(geometry)
    )
      return;
    if (!parseGeometry(geometry)) return;

    state.seenModels.add(geometry);
    state.models.push(geometry);
    updateButton();
    log("Geometry captured:", state.models.length);
  };

  page.drawhookcanvas = function drawHookCanvas(resource, imageModel) {
    try {
      const images = safeArray(imageModel?.attributes?.images);
      if (!resource || !images.length) return resource;

      const requestedFormat = resource?.options?.format;
      let best = resource;
      let bestSize = Number(resource?.size) || 0;

      for (const image of images) {
        const width = Number(image?.width) || 0;
        const height = Number(image?.height) || 0;
        const size = Number(image?.size) || width * height;
        const formatMatches =
          requestedFormat !== "A" || image?.options?.format === "A";
        if (width > 0 && height > 0 && formatMatches && size > bestSize) {
          best = image;
          bestSize = size;
        }
      }

      const url = normalizeUrl(best?.url);
      if (url) {
        const rawName =
          imageModel?.attributes?.name ||
          `texture-${state.wantedTextures.size + 1}`;
        state.wantedTextures.set(url, sanitizeFilename(rawName));
        const role = detectTextureRole(
          rawName,
          imageModel?.attributes?.type,
          imageModel?.attributes?.channel,
          imageModel?.attributes?.slot,
          imageModel?.attributes?.usage,
          imageModel?._name,
        );
        if (role) state.textureRolesByUrl.set(url, role);
      }
      return best;
    } catch (error) {
      warn("Texture selection failed:", error);
      return resource;
    }
  };

  function findImageLike(payload) {
    if (!payload) return null;
    if (payload.currentSrc || payload.src) return payload;
    if (Array.isArray(payload) || typeof payload.length === "number") {
      return (
        Array.from(payload).find((item) => item?.currentSrc || item?.src) ||
        payload[5] ||
        null
      );
    }
    return null;
  }

  page.drawhookimg = function drawHookImage(gl, payload) {
    try {
      const image = findImageLike(payload);
      const url = normalizeUrl(image?.currentSrc || image?.src);
      const wantedName = state.wantedTextures.get(url);
      if (!gl || !image || !wantedName || state.capturedTextureUrls.has(url))
        return;

      const width = Number(image.width || image.naturalWidth) || 0;
      const height = Number(image.height || image.naturalHeight) || 0;
      if (!width || !height || width * height > MAX_TEXTURE_PIXELS) return;
      if (gl.drawingBufferWidth < width || gl.drawingBufferHeight < height)
        return;

      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      if (gl.getError() !== gl.NO_ERROR) return;

      const rowSize = width * 4;
      const row = new Uint8Array(rowSize);
      for (let y = 0; y < Math.floor(height / 2); y += 1) {
        const top = y * rowSize;
        const bottom = (height - y - 1) * rowSize;
        row.set(pixels.subarray(top, top + rowSize));
        pixels.copyWithin(top, bottom, bottom + rowSize);
        pixels.set(row, bottom);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return;

      const imageData = context.createImageData(width, height);
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);
      state.capturedTextureUrls.add(url);

      const filename = buildTextureFilename(
        wantedName,
        url,
        `texture-${state.files.size + 1}`,
      );
      const pending = new Promise((resolve) => {
        let settled = false;
        const finish = (blob) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutId);
          if (blob) {
            state.files.set(filename, blob);
            state.textureManifest.push({
              file: filename,
              originalName: wantedName,
              role: getTextureRole(url, wantedName) || null,
              width,
              height,
              capturedBy: "render-hook",
            });
          } else state.capturedTextureUrls.delete(url);
          resolve();
        };
        const timeoutId = setTimeout(() => finish(null), TEXTURE_WAIT_MS);
        try {
          canvas.toBlob(finish, "image/png");
        } catch (error) {
          warn("PNG conversion failed:", error);
          finish(null);
        }
      });
      state.pendingBlobs.add(pending);
      pending.finally(() => state.pendingBlobs.delete(pending));
    } catch (error) {
      warn("Texture capture failed:", error);
    }
  };

  const modifications = [
    {
      name: "render-input",
      required: false,
      variants: [
        ["A.renderInto(n,E,R", ",i"],
        ["x.renderInto(n,S,y", ",i"],
      ],
    },
    {
      name: "image-data-parameter",
      required: false,
      variants: [["g.renderInto=function(e,i,r", ",image_data"]],
    },
    {
      name: "texture-readback",
      required: false,
      variants: [
        ["t.drawArrays(t.TRIANGLES,0,6)", ",window.drawhookimg(t,image_data)"],
      ],
    },
    {
      name: "texture-selection",
      required: false,
      variants: [
        [
          "getResourceImage:function(e,t){",
          "e=window.drawhookcanvas(e,this._imageModel);",
        ],
      ],
    },
    {
      name: "geometry-capture",
      required: true,
      variants: [
        [
          "this._stateCache.drawGeometry(this._graphicContext,t)",
          ";window.attachbody(t)",
        ],
      ],
    },
  ];

  function patchBundle(source) {
    let output = source;
    const applied = [];
    const missedRequired = [];

    for (const modification of modifications) {
      const variant = modification.variants.find(([needle]) =>
        output.includes(needle),
      );
      if (!variant) {
        if (modification.required) missedRequired.push(modification.name);
        continue;
      }
      const [needle, addition] = variant;
      output = output.replace(needle, needle + addition);
      applied.push(modification.name);
    }

    return { output, applied, missedRequired };
  }

  function fetchScriptSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    const successful = request.status >= 200 && request.status < 300;
    if (!successful || !request.responseText) {
      throw new Error(
        `HTTP ${request.status || "unknown"} while reading ${url}`,
      );
    }
    return request.responseText;
  }

  function executeReplacement(original, source) {
    const replacement = document.createElement("script");
    for (const attribute of original.attributes) {
      if (!["src", "integrity"].includes(attribute.name)) {
        replacement.setAttribute(attribute.name, attribute.value);
      }
    }
    replacement.dataset.sfrPatched = "true";
    replacement.textContent = `${source}\n//# sourceURL=${original.src}?sfr-patched`;
    (
      original.parentNode ||
      document.head ||
      document.documentElement
    ).appendChild(replacement);
  }

  function isViewerBundle(script) {
    const src = script?.src || "";
    return (
      Boolean(src) &&
      (src.includes("/web/dist/") || src.includes("standaloneViewer"))
    );
  }

  function inspectAddedScript(script) {
    if (!(script instanceof HTMLScriptElement) || !isViewerBundle(script))
      return;
    if (script.dataset.sfrPatched || state.patchedScripts.has(script.src))
      return;

    try {
      const source = fetchScriptSynchronously(script.src);
      const result = patchBundle(source);
      if (result.missedRequired.length) {
        warn("Bundle unmodified: essential hook missing.", {
          url: script.src,
          missing: result.missedRequired,
          optionalApplied: result.applied,
        });
        return;
      }

      state.patchedScripts.add(script.src);
      script.textContent = "";
      script.remove();
      executeReplacement(script, result.output);
      state.patchCount += 1;
      log("Bundle modified:", result.applied);
      mountButton();
    } catch (error) {
      warn(
        "Interception canceled; original script left intact:",
        error,
      );
    }
  }

  const scriptObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) inspectAddedScript(node);
    }
  });
  scriptObserver.observe(document, { childList: true, subtree: true });

  installWebGLHook(page.WebGLRenderingContext);
  installWebGLHook(page.WebGL2RenderingContext);

  const initializeUiAndCatalog = () => {
    readTextureCatalog();
    mountButton();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeUiAndCatalog, {
      once: true,
    });
  } else {
    initializeUiAndCatalog();
  }
})();
