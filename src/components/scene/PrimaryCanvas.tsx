"use client";

import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, StatsGl } from "@react-three/drei";
import type * as THREE from "three";
import ProductModelLoader from "./ProductModelLoader";
import EffectsStack from "./EffectsStack";
import { useTweakpane } from "@/hooks/useTweakpane";
import Floor from "./Floor";
import EditorLoader from "./EditorLoader";
import EnvLoader from "./EnvLoader";
import CameraRig from "./CameraRig";
import { useThemeStore } from "@/stores/useThemeStore";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

const PrimaryScene = () => {
  const { theme } = useThemeStore();
  const { showFPS, showGizmo, showFog, fogNear, fogFar } = useTweakpane(
    { title: "☀️ Scene", expanded: false },
    {
      showFPS: { value: false, label: "show fps" },
      showGizmo: { value: false, label: "show gizmo" },
      showFog: { value: true, label: "enable fog", folder: "Fog" },
      fogNear: {
        value: 0.3,
        min: 0.1,
        max: 100,
        label: "fog near",
        folder: "Fog",
      },
      fogFar: {
        value: 70,
        min: 0.1,
        max: 100,
        label: "fog far",
        folder: "Fog",
      },
    },
  );

  // derive fog color from the active theme so it blends with the ui background
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const fogColor = isDark ? "#0a0a0a" : "#ffffff";

  return (
    <>
      <Suspense fallback={null}>
        <ProductModelLoader />
        <Floor />
        <StatsGl
          className={`${showFPS ? "block" : "hidden"} fixed top-3/4 left-4`}
          horizontal={false}
        />
        {showFog && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
        <color attach="background" args={[fogColor]} />
        <EnvLoader />
        <CameraRig />
        <GizmoHelper
          renderPriority={2}
          alignment="bottom-left"
          margin={[160, 140]}
          visible={showGizmo}
        >
          <group scale={[0.9, 0.9, 0.9]}>
            <GizmoViewport disabled visible={showGizmo} labelColor="white" />
          </group>
        </GizmoHelper>
      </Suspense>
    </>
  );
};

const PrimaryCanvas = () => {
  const { activeModel } = useConfiguratorStore();
  const [isContextLost, setIsContextLost] = useState(false);

  // handle webgl context loss and restoration events
  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvasElement = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setIsContextLost(true);
    };
    const handleContextRestored = () => {
      setIsContextLost(false);
    };

    canvasElement.addEventListener("webglcontextlost", handleContextLost, false);
    canvasElement.addEventListener("webglcontextrestored", handleContextRestored, false);
  }, []);

  const { setDpr } = useTweakpane(
    { title: "☀️ Scene", expanded: true },
    {
      setDpr: {
        value: 1,
        min: 0.1,
        max: 1,
        step: 0.1,
        label: "viewport resolution",
      },
    },
  );

  return (
    <>
      <EditorLoader />
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`active product model is ${activeModel}`}
      </div>
      {isContextLost && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
          <p className="text-sm font-medium">three dimensional context lost attempting recovery</p>
        </div>
      )}
      <Canvas
        role="img"
        aria-label="Interactive 3D product configurator viewport"
        shadows={"soft"}
        dpr={setDpr}
        onCreated={handleCreated}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <PrimaryScene />
        <EffectsStack />
      </Canvas>
    </>
  );
};

export default PrimaryCanvas;
