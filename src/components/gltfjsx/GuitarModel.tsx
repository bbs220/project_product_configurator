import * as THREE from "three";
import { useGLTF, Html, Line } from "@react-three/drei";
import { JSX, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { assetPaths } from "@/lib/utils";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

function PartLabel({
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
        className={`select-none transition-opacity duration-500 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800/50 whitespace-nowrap text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          {title}
        </div>
      </Html>
    </group>
  );
}

type GLTFResult = GLTF & {
  nodes: {
    body: THREE.Mesh;
    bodyCover: THREE.Mesh;
    bodyCoverAccentRing: THREE.Mesh;
    coverScrewsA: THREE.Mesh;
    coverScrewsB: THREE.Mesh;
    toneControlA: THREE.Mesh;
    toneControlB: THREE.Mesh;
    volumeControl: THREE.Mesh;
    neakHead: THREE.Mesh;
    frets: THREE.Mesh;
    pickupBridge: THREE.Mesh;
    strings6to1: THREE.Mesh;
    stringTrees: THREE.Mesh;
    tuningKeys: THREE.Mesh;
    neckHeadSupport: THREE.Mesh;
    outputJack: THREE.Mesh;
    pickups: THREE.Mesh;
    pickupSelectorBox: THREE.Mesh;
    pickupSelector: THREE.Mesh;
    strapButton: THREE.Mesh;
    termoloArmAndBridge: THREE.Mesh;
  };
  materials: {
    BodyMaterial: THREE.MeshPhysicalMaterial;
    NeckMaterial: THREE.MeshPhysicalMaterial;
    white: THREE.MeshStandardMaterial;
    MetalPartsMaterial: THREE.MeshStandardMaterial;
    StringMaterial: THREE.MeshStandardMaterial;
  };
};

export function GuitarModel(props: JSX.IntrinsicElements["group"]) {
  const { isExploded, showLabels } = useConfiguratorStore();
  const bodyRef = useRef<THREE.Mesh>(null);
  const coverRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.Mesh>(null);
  const pickupsRef = useRef<THREE.Mesh>(null);
  const bridgeRef = useRef<THREE.Mesh>(null);
  const outputJackRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const speed = 4 * delta;

    // Lift the entire guitar up slightly when exploded
    if (bodyRef.current) {
      bodyRef.current.position.lerp(
        new THREE.Vector3(0, isExploded ? 1 : 0, 0),
        speed,
      );
    }

    // Cover goes forward and up
    if (coverRef.current) {
      coverRef.current.position.lerp(
        new THREE.Vector3(0, isExploded ? 0.5 : 0, isExploded ? 1.5 : 0),
        speed,
      );
    }

    // Neck goes left and back
    if (neckRef.current) {
      neckRef.current.position.lerp(
        new THREE.Vector3(
          isExploded ? -1 : 0,
          isExploded ? 0.5 : 0,
          isExploded ? -0.5 : 0,
        ),
        speed,
      );
    }

    // Pickups go right and forward
    if (pickupsRef.current) {
      pickupsRef.current.position.lerp(
        new THREE.Vector3(
          isExploded ? 0.5 : 0,
          isExploded ? -0.5 : 0,
          isExploded ? 1 : 0,
        ),
        speed,
      );
    }

    // Bridge goes right and back
    if (bridgeRef.current) {
      bridgeRef.current.position.lerp(
        new THREE.Vector3(
          isExploded ? 1 : 0,
          isExploded ? -1 : 0,
          isExploded ? -1 : 0,
        ),
        speed,
      );
    }

    // Output jack goes down and right
    if (outputJackRef.current) {
      outputJackRef.current.position.lerp(
        new THREE.Vector3(isExploded ? 1.5 : 0, isExploded ? -1.5 : 0, 0),
        speed,
      );
    }
  });

  const { nodes, materials } = useGLTF(
    assetPaths.guitar,
  ) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh
          ref={bodyRef}
          name="body"
          castShadow
          receiveShadow
          geometry={nodes.body.geometry}
          material={materials.BodyMaterial}
        >
          <PartLabel
            show={showLabels && isExploded}
            title="Body"
            offset={[-4, 0, 0]}
            geometry={nodes.body.geometry}
          />
          <mesh
            ref={coverRef}
            name="bodyCover"
            castShadow
            receiveShadow
            geometry={nodes.bodyCover.geometry}
            material={materials.NeckMaterial}
          >
            <PartLabel
              show={showLabels && isExploded}
              title="Pickguard"
              offset={[4, 0, 0]}
              geometry={nodes.bodyCover.geometry}
            />
            <mesh
              name="bodyCoverAccentRing"
              castShadow
              receiveShadow
              geometry={nodes.bodyCoverAccentRing.geometry}
              material={materials.white}
            />
            <mesh
              name="coverScrewsA"
              castShadow
              receiveShadow
              geometry={nodes.coverScrewsA.geometry}
              material={materials.MetalPartsMaterial}
            />
            <mesh
              name="coverScrewsB"
              castShadow
              receiveShadow
              geometry={nodes.coverScrewsB.geometry}
              material={materials.MetalPartsMaterial}
            />
            <mesh
              name="toneControlA"
              castShadow
              receiveShadow
              geometry={nodes.toneControlA.geometry}
              material={materials.NeckMaterial}
            />
            <mesh
              name="toneControlB"
              castShadow
              receiveShadow
              geometry={nodes.toneControlB.geometry}
              material={materials.NeckMaterial}
            />
            <mesh
              name="volumeControl"
              castShadow
              receiveShadow
              geometry={nodes.volumeControl.geometry}
              material={materials.NeckMaterial}
            />
          </mesh>
          <mesh
            ref={neckRef}
            name="neakHead"
            castShadow
            receiveShadow
            geometry={nodes.neakHead.geometry}
            material={materials.NeckMaterial}
          >
            <PartLabel
              show={showLabels && isExploded}
              title="Neck & Head"
              offset={[-3, 3, 0]}
              geometry={nodes.neakHead.geometry}
            />
            <mesh
              name="frets"
              castShadow
              receiveShadow
              geometry={nodes.frets.geometry}
              material={materials.MetalPartsMaterial}
            />
            <mesh
              name="pickupBridge"
              castShadow
              receiveShadow
              geometry={nodes.pickupBridge.geometry}
              material={materials.MetalPartsMaterial}
            />
            <mesh
              name="strings6to1"
              castShadow
              receiveShadow
              geometry={nodes.strings6to1.geometry}
              material={materials.StringMaterial}
            />
            <mesh
              name="stringTrees"
              castShadow
              receiveShadow
              geometry={nodes.stringTrees.geometry}
              material={materials.MetalPartsMaterial}
            />
            <mesh
              name="tuningKeys"
              castShadow
              receiveShadow
              geometry={nodes.tuningKeys.geometry}
              material={materials.MetalPartsMaterial}
            />
          </mesh>
          <mesh
            name="neckHeadSupport"
            castShadow
            receiveShadow
            geometry={nodes.neckHeadSupport.geometry}
            material={materials.MetalPartsMaterial}
          />
          <mesh
            ref={outputJackRef}
            name="outputJack"
            castShadow
            receiveShadow
            geometry={nodes.outputJack.geometry}
            material={materials.MetalPartsMaterial}
          >
            <PartLabel
              show={showLabels && isExploded}
              title="Output Jack"
              offset={[4, 1.5, 0]}
              geometry={nodes.outputJack.geometry}
            />
          </mesh>
          <mesh
            ref={pickupsRef}
            name="pickups"
            castShadow
            receiveShadow
            geometry={nodes.pickups.geometry}
            material={materials.NeckMaterial}
          >
            <PartLabel
              show={showLabels && isExploded}
              title="Pickups"
              offset={[-4, 1.5, 0]}
              geometry={nodes.pickups.geometry}
            />
          </mesh>
          <mesh
            name="pickupSelectorBox"
            castShadow
            receiveShadow
            geometry={nodes.pickupSelectorBox.geometry}
            material={materials.MetalPartsMaterial}
          >
            <mesh
              name="pickupSelector"
              castShadow
              receiveShadow
              geometry={nodes.pickupSelector.geometry}
              material={materials.NeckMaterial}
            />
          </mesh>
          <mesh
            name="strapButton"
            castShadow
            receiveShadow
            geometry={nodes.strapButton.geometry}
            material={materials.MetalPartsMaterial}
          />
          <mesh
            ref={bridgeRef}
            name="termoloArmAndBridge"
            castShadow
            receiveShadow
            geometry={nodes.termoloArmAndBridge.geometry}
            material={materials.MetalPartsMaterial}
          >
            <PartLabel
              show={showLabels && isExploded}
              title="Tremolo & Bridge"
              offset={[3, 3, 0]}
              geometry={nodes.termoloArmAndBridge.geometry}
            />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(assetPaths.guitar);
