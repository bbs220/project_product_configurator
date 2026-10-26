"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useConfiguratorStore,
  MODEL_CAMERA_TARGETS,
  MODEL_EXPLODED_CAMERA_POSITIONS,
  MODEL_EXPLODED_CAMERA_TARGETS,
} from "@/stores/useConfiguratorStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// maximum pan distance offsets allowed from model center
const PAN_LIMITS = {
  x: 2.0,
  y: 1.2,
  z: 1.5,
};

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
    if (!controlsRef.current) return;

    // clamp pan target and position within bounding box
    const center = isExploded
      ? MODEL_EXPLODED_CAMERA_TARGETS[activeModel]
      : MODEL_CAMERA_TARGETS[activeModel];

    const currentX = controlsRef.current.target.x;
    const currentY = controlsRef.current.target.y;
    const currentZ = controlsRef.current.target.z;

    const clampedX = THREE.MathUtils.clamp(
      currentX,
      center[0] - PAN_LIMITS.x,
      center[0] + PAN_LIMITS.x,
    );
    const clampedY = THREE.MathUtils.clamp(
      currentY,
      center[1] - PAN_LIMITS.y,
      center[1] + PAN_LIMITS.y,
    );
    const clampedZ = THREE.MathUtils.clamp(
      currentZ,
      center[2] - PAN_LIMITS.z,
      center[2] + PAN_LIMITS.z,
    );

    const diffX = clampedX - currentX;
    const diffY = clampedY - currentY;
    const diffZ = clampedZ - currentZ;

    if (diffX !== 0 || diffY !== 0 || diffZ !== 0) {
      controlsRef.current.target.set(clampedX, clampedY, clampedZ);
      state.camera.position.x += diffX;
      state.camera.position.y += diffY;
      state.camera.position.z += diffZ;
    }

    if (isLerping.current) {
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
        enablePan={true}
        screenSpacePanning={true}
      />
    </>
  );
}
