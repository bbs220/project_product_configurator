"use client";

import { useSearchParams } from "next/navigation";
import { WatchModel } from "../gltfjsx/WatchModel";
import { KeyboardModel } from "../gltfjsx/KeyboardModel";
import { MTBikeModel } from "../gltfjsx/MTBikeModel";
import { GuitarModel } from "../gltfjsx/GuitarModel";

const ProductModelLoader = () => {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("model") || "watch";

  return (
    <group position={[0, 0, 0]} scale={[1, 1, 1]}>
      {modelName === "watch" && <WatchModel />}
      {modelName === "keyboard" && <KeyboardModel />}
      {modelName === "mtBike" && <MTBikeModel />}
      {modelName === "guitar" && <GuitarModel />}
    </group>
  );
};

export default ProductModelLoader;
