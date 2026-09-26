"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { assetPaths } from "@/src/lib/utils";
import { useGLTF, useAnimations } from "@react-three/drei";

const ProductModelLoader = () => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(assetPaths.engine);
  const { actions, names } = useAnimations(animations, group);

  // play all animations on load
  useEffect(() => {
    names.forEach((name) => {
      actions[name]?.reset().play();
    });
  }, [actions, names]);

  return (
    <group ref={group} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
    </group>
  );
};

export default ProductModelLoader;
