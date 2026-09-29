"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
  StatsGl,
} from "@react-three/drei";
import ProductModelLoader from "./ProductModelLoader";
import EffectsStack from "./EffectsStack";
import { useTweakpane } from "@/hooks/useTweakpane";
import Floor from "./Floor";
import EditorLoader from "./EditorLoader";
import EnvLoader from "./EnvLoader";
import { useSidebarStore } from "@/stores/useSidebarStore";

const PrimaryScene = () => {
  const { isSidebarOpen } = useSidebarStore();
  const { showFPS, showGizmo, showFog, fogColor, fogDensity } = useTweakpane(
    { title: "☀️ Scene", expanded: false },
    {
      showFPS: { value: false, label: "show fps" },
      showGizmo: { value: false, label: "show gizmo" },
      showFog: { value: true, label: "enable fog", folder: "Fog" },
      fogColor: { value: "#000000", label: "fog color", folder: "Fog" },
      fogDensity: {
        value: 0.03,
        min: 0.01,
        max: 1,
        label: "fog density",
        folder: "Fog",
      },
    },
  );
  return (
    <>
      <Suspense fallback={null}>
        <ProductModelLoader />
        <Floor />
        <StatsGl
          className={`${showFPS ? "block" : "hidden"} fixed top-16 ${isSidebarOpen ? "left-72" : "left-14"}`}
          horizontal={false}
        />
        <EnvLoader />
        <OrbitControls makeDefault maxPolarAngle={1.5} maxDistance={10} />
        {showFog && <fogExp2 attach="fog" args={[fogColor, fogDensity]} />}
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
        <GizmoHelper
          renderPriority={2}
          alignment="top-left"
          margin={[160, 60]}
          visible={showGizmo}
        >
          <GizmoViewport disabled visible={showGizmo} />
        </GizmoHelper>
      </Suspense>
    </>
  );
};

const PrimaryCanvas = () => {
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
      <Canvas shadows={"soft"} dpr={setDpr}>
        <PrimaryScene />
        <EffectsStack />
      </Canvas>
    </>
  );
};

export default PrimaryCanvas;
