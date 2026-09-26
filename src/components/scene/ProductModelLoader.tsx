"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { assetPaths } from "@/lib/utils";

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
    <group ref={group} position={[0, 0, 0]} scale={[0.2, 0.2, 0.2]}>
      <primitive object={scene} />
    </group>
  );
};

export default ProductModelLoader;
