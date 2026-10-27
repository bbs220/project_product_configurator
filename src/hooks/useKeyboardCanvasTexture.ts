import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { renderKeyboardScreen } from "@/lib/keyboardScreenRenderer";

type KeyboardDisplayManager = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture;
  matrixInitialized: boolean;
};

// create dynamic offscreen canvas texture manager for keyboard oled display
function createKeyboardDisplayManager(): KeyboardDisplayManager {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return {
    canvas,
    ctx,
    texture,
    matrixInitialized: false,
  };
}

// configure precise uv transform matrix mapping screen mesh to normalized canvas
function initTextureMatrix(manager: KeyboardDisplayManager) {
  if (manager.matrixInitialized) return;

  manager.texture.matrix.set(
    0.0,
    9.44376,
    0.740863,
    -0.285714,
    0.0,
    0.955,
    0.0,
    0.0,
    1.0,
  );
  manager.texture.matrixAutoUpdate = false;
  manager.texture.flipY = false;
  manager.texture.wrapS = THREE.ClampToEdgeWrapping;
  manager.texture.wrapT = THREE.ClampToEdgeWrapping;
  manager.matrixInitialized = true;
}

// render canvas frame and request texture upload to graphics pipeline
function drawKeyboardDisplayFrame(
  manager: KeyboardDisplayManager,
  style: ReturnType<typeof useConfiguratorStore.getState>["keyboardDisplayStyle"],
  theme: ReturnType<typeof useConfiguratorStore.getState>["keyboardDisplayTheme"],
  now: Date,
  timeSec: number,
) {
  initTextureMatrix(manager);

  const ctx = manager.ctx;
  if (!ctx) return;

  renderKeyboardScreen(
    ctx,
    manager.canvas.width,
    manager.canvas.height,
    style,
    theme,
    now,
    timeSec,
  );

  manager.texture.needsUpdate = true;
}

// dynamic live canvas texture hook for mechanical keyboard oled display
export function useKeyboardCanvasTexture() {
  const { keyboardDisplayStyle, keyboardDisplayTheme } = useConfiguratorStore();
  const [manager] = useState<KeyboardDisplayManager>(createKeyboardDisplayManager);
  const timeAccumulatorRef = useRef(0);

  // dispose texture on unmount
  useEffect(() => {
    return () => {
      manager.texture.dispose();
    };
  }, [manager]);

  // throttled render loop avoiding gpu bus flooding
  useFrame((state, delta) => {
    timeAccumulatorRef.current += delta;
    // throttle animation updates to approximately thirty frames per second
    if (timeAccumulatorRef.current < 0.033) {
      return;
    }
    timeAccumulatorRef.current = 0;

    const now = new Date();
    drawKeyboardDisplayFrame(
      manager,
      keyboardDisplayStyle,
      keyboardDisplayTheme,
      now,
      state.clock.elapsedTime,
    );
  });

  return manager.texture;
}
