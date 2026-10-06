"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function CameraRig() {
  const { cameraPosition, cameraMinDistance, cameraMaxDistance, isExploded, activeModel } =
    useConfiguratorStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(...cameraPosition));
  const targetLook = useRef(new THREE.Vector3(0, 1, 0));
  const isLerping = useRef(false);

  useEffect(() => {
    // Determine the desired camera state based on activeModel and isExploded
    if (isExploded) {
      if (activeModel === "watch") {
        targetPos.current.set(0, 4, -9);
        targetLook.current.set(0, 2.5, 0);
      }
    } else {
      if (activeModel === "watch") {
        targetPos.current.set(...cameraPosition);
        targetLook.current.set(0, 1, 0);
      }
    }
    isLerping.current = true;
  }, [isExploded, activeModel, cameraPosition]);

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
        onStart={() => {
          // Allow user interaction to interrupt the animation
          isLerping.current = false;
        }}
      />
    </>
  );
}
