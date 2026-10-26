import { useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import {
  renderModularUltra,
  renderWayfinder,
} from "@/lib/watchFaceRenderer";

type WatchDisplayManager = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture;
};

// create dynamic canvas texture manager
function createWatchDisplayManager(): WatchDisplayManager {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return { canvas, ctx, texture };
}

// render canvas frame and request texture upload to gpu
function drawWatchDisplayFrame(
  manager: WatchDisplayManager,
  style: string,
  nightMode: boolean,
) {
  const ctx = manager.ctx;
  if (!ctx) return;

  const now = new Date();
  if (style === "wayfinder") {
    renderWayfinder(ctx, 1024, 1024, now, nightMode);
  } else {
    renderModularUltra(ctx, 1024, 1024, now, nightMode);
  }

  manager.texture.needsUpdate = true;
}

// create dynamic offscreen canvas texture for smartwatch display
export function useWatchCanvasTexture() {
  const { watchFaceStyle, watchNightMode } = useConfiguratorStore();
  const [manager] = useState<WatchDisplayManager>(createWatchDisplayManager);

  // dispose texture on unmount
  useEffect(() => {
    return () => {
      manager.texture.dispose();
    };
  }, [manager]);

  // update canvas every frame for sweeping second hand and live time
  useFrame(() => {
    drawWatchDisplayFrame(manager, watchFaceStyle, watchNightMode);
  });

  return manager.texture;
}

