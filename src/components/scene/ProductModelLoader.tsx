"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { assetPaths } from "@/lib/utils";

const ProductModelLoader = () => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(assetPaths.veneno);
  const { actions, names } = useAnimations(animations, group);

  // play all animations on load
  useEffect(() => {
    names.forEach((name) => {
      actions[name]?.reset().play();
    });
  }, [actions, names]);

  return (
    <group ref={group} position={[0, 0, 0]} scale={[1, 1, 1]} castShadow>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(assetPaths.veneno);
useGLTF.preload(assetPaths.gt3);

export default ProductModelLoader;
