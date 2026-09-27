"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Environment,
} from "@react-three/drei";
import ProductModelLoader from "./ProductModelLoader";
import EffectsStack from "./EffectsStack";
import { useTweakpane } from "@/hooks/useTweakpane";
import Floor from "./Floor";

const PrimaryScene = () => {
  const { showFPS, showGizmo } = useTweakpane(
    { title: "☀️ Scene" },
    {
      showFPS: { value: true, label: "show fps" },
      showGizmo: { value: true, label: "show gizmo" },
    },
  );
  return (
    <>
      <Suspense fallback={null}>
        <ProductModelLoader />
        <Floor />
        <Stats showPanel={showFPS ? 0 : 4} />
        <Environment preset="city" />
        <OrbitControls makeDefault />
        <PerspectiveCamera makeDefault position={[0, 10, 20]} />
        <GizmoHelper
          renderPriority={2}
          alignment="top-left"
          margin={[60, 110]}
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
    <Canvas shadows={"soft"} dpr={setDpr}>
      <PrimaryScene />
      <EffectsStack />
    </Canvas>
  );
};

export default PrimaryCanvas;
