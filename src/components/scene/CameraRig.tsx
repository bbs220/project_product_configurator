"use client";

import { useRef } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function CameraRig() {
  const { cameraPosition, cameraMinDistance, cameraMaxDistance } =
    useConfiguratorStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={60}
        focus={10}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        maxPolarAngle={1.5}
        maxDistance={cameraMaxDistance}
        minDistance={cameraMinDistance}
        target={[0, 1, 0]}
      />
    </>
  );
}
