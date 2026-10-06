"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { assetPaths } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

const ProductModelLoader = () => {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("model") || "watch";

  // ensure we don't load an invalid model if the url param is messed with
  const modelPath =
    modelName in assetPaths
      ? assetPaths[modelName as keyof typeof assetPaths]
      : assetPaths.watch;

  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  return (
    <group ref={group} position={[0, 0, 0]} scale={[1, 1, 1]} castShadow>
      <primitive object={scene} />
    </group>
  );
};

export default ProductModelLoader;
