import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import {
  createModularUltraBackground,
  createWayfinderBackground,
  renderModularUltra,
  renderWayfinder,
} from "@/lib/watchFaceRenderer";

type WatchDisplayManager = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture;
  bgModular: HTMLCanvasElement | null;
  bgWayfinder: HTMLCanvasElement | null;
  cachedNightMode: boolean | null;
};

// create dynamic canvas texture manager with pre rendered background cache
function createWatchDisplayManager(): WatchDisplayManager {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return {
    canvas,
    ctx,
    texture,
    bgModular: null,
    bgWayfinder: null,
    cachedNightMode: null,
  };
}

// render canvas frame and request texture upload to gpu
function drawWatchDisplayFrame(
  manager: WatchDisplayManager,
  style: string,
  nightMode: boolean,
) {
  const ctx = manager.ctx;
  if (!ctx) return;

  // regenerate background cache if night mode toggled or first run
  if (manager.cachedNightMode !== nightMode || !manager.bgModular || !manager.bgWayfinder) {
    manager.bgModular = createModularUltraBackground(512, 512, nightMode);
    manager.bgWayfinder = createWayfinderBackground(512, 512, nightMode);
    manager.cachedNightMode = nightMode;
  }

  const now = new Date();
  if (style === "wayfinder") {
    renderWayfinder(ctx, 512, 512, now, nightMode, manager.bgWayfinder);
  } else {
    renderModularUltra(ctx, 512, 512, now, nightMode, manager.bgModular);
  }

  manager.texture.needsUpdate = true;
}

// create dynamic offscreen canvas texture for smartwatch display
export function useWatchCanvasTexture() {
  const { watchFaceStyle, watchNightMode } = useConfiguratorStore();
  const [manager] = useState<WatchDisplayManager>(createWatchDisplayManager);
  const timeAccumulatorRef = useRef(0);
  const lastSecondRef = useRef(-1);

  // dispose texture on unmount
  useEffect(() => {
    return () => {
      manager.texture.dispose();
    };
  }, [manager]);

  // throttled render in animation frame loop avoiding gpu bus flooding
  useFrame((_, delta) => {
    const isAnalog = watchFaceStyle === "wayfinder";

    if (isAnalog) {
      timeAccumulatorRef.current += delta;
      // throttle analog updates to approximately thirty frames per second
      if (timeAccumulatorRef.current < 0.033) {
        return;
      }
      timeAccumulatorRef.current = 0;
    } else {
      const currentSecond = Math.floor(Date.now() / 1000);
      // throttle digital updates to once per second
      if (currentSecond === lastSecondRef.current) {
        return;
      }
      lastSecondRef.current = currentSecond;
    }

    drawWatchDisplayFrame(manager, watchFaceStyle, watchNightMode);
  });

  return manager.texture;
}
