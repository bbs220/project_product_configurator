"use client";

import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";

export function PartLabel({
  show,
  title,
  geometry,
  position = [0, 0, 0],
  offset = [2, 0, 0],
}: {
  show: boolean;
  title: string;
  geometry?: THREE.BufferGeometry;
  position?: [number, number, number];
  offset?: [number, number, number];
}) {
  const center = useMemo(() => {
    if (geometry) {
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const c = new THREE.Vector3();
      geometry.boundingBox?.getCenter(c);
      return c;
    }
    return new THREE.Vector3(...position);
  }, [geometry, position]);

  const targetPos = useMemo(() => {
    return center.clone().add(new THREE.Vector3(offset[0], offset[1], 0));
  }, [center, offset]);

  const points = useMemo(() => [center, targetPos], [center, targetPos]);

  return (
    <group>
      <Line
        points={points}
        color="#888888"
        lineWidth={2}
        transparent
        opacity={show ? 0.8 : 0}
        visible={show}
      />
      <Html
        position={targetPos}
        center
        zIndexRange={[100, 0]}
        className={`select-none transition-opacity duration-500 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          data-part-label="true"
          data-label-title={title}
          className="px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800/50 whitespace-nowrap text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          {title}
        </div>
      </Html>
    </group>
  );
}
