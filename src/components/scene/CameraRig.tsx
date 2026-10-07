"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useConfiguratorStore,
  MODEL_EXPLODED_CAMERA_POSITIONS,
  MODEL_EXPLODED_CAMERA_TARGETS,
} from "@/stores/useConfiguratorStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function CameraRig() {
  const {
    cameraPosition,
    cameraTarget,
    cameraFov,
    cameraMinDistance,
    cameraMaxDistance,
    isExploded,
    activeModel,
  } = useConfiguratorStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(...cameraPosition));
  const targetLook = useRef(new THREE.Vector3(...cameraTarget));
  const isLerping = useRef(false);

  useEffect(() => {
    // Determine the desired camera state based on activeModel and isExploded
    if (isExploded) {
      targetPos.current.set(...MODEL_EXPLODED_CAMERA_POSITIONS[activeModel]);
      targetLook.current.set(...MODEL_EXPLODED_CAMERA_TARGETS[activeModel]);
    } else {
      if (["watch", "guitar", "keyboard", "mtBike"].includes(activeModel)) {
        targetPos.current.set(...cameraPosition);
        targetLook.current.set(...cameraTarget);
      }
    }
    isLerping.current = true;
  }, [isExploded, activeModel, cameraPosition, cameraTarget]);

  useFrame((state, delta) => {
    if (!isLerping.current || !controlsRef.current) return;

    const speed = 4 * delta;
    state.camera.position.lerp(targetPos.current, speed);
    controlsRef.current.target.lerp(targetLook.current, speed);
    controlsRef.current.update();

    if (
      state.camera.position.distanceTo(targetPos.current) < 0.1 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.1
    ) {
      isLerping.current = false;
    }
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        maxPolarAngle={1.5}
        maxDistance={cameraMaxDistance}
        minDistance={cameraMinDistance}
        target={cameraTarget}
        onStart={() => {
          isLerping.current = false;
        }}
      />
    </>
  );
}
