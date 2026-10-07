import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { JSX, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { assetPaths } from "@/lib/utils";
import { GuitarGLTFResult } from "@/types/models";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { PartLabel } from "@/lib/PartLabel";

export const GUITAR_EXPLODED_CONFIG = {
  body: {
    part: new THREE.Vector3(0, 0, 0),
    label: [0, 1, 0] as [number, number, number],
  },
  cover: {
    part: new THREE.Vector3(2, 0.5, 0),
    label: [0.1, 1, 0] as [number, number, number],
  },
  neck: {
    part: new THREE.Vector3(1, 0, 0),
    label: [0, -1.8, 0] as [number, number, number],
  },
  pickups: {
    part: new THREE.Vector3(-2, 0, 0),
    label: [-0.1, 1.5, 0] as [number, number, number],
  },
  bridge: {
    part: new THREE.Vector3(3, 0, 0),
    label: [0.1, 1, 0] as [number, number, number],
  },
  outputJack: {
    part: new THREE.Vector3(-1, 0, 0),
    label: [-0.1, 1, 0] as [number, number, number],
  },
};

export function GuitarModel(props: JSX.IntrinsicElements["group"]) {
  const { isExploded, showLabels } = useConfiguratorStore();
  const sceneRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const coverRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.Mesh>(null);
  const pickupsRef = useRef<THREE.Mesh>(null);
  const bridgeRef = useRef<THREE.Mesh>(null);
  const outputJackRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const speed = 4 * delta;

    if (sceneRef.current) {
      sceneRef.current.position.lerp(
        new THREE.Vector3(0, isExploded ? 2.5 : 0, 0),
        speed,
      );
    }

    if (bodyRef.current) {
      bodyRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.body.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }

    if (coverRef.current) {
      coverRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.cover.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }

    if (neckRef.current) {
      neckRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.neck.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }

    if (pickupsRef.current) {
      pickupsRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.pickups.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }

    if (bridgeRef.current) {
      bridgeRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.bridge.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }

    if (outputJackRef.current) {
      outputJackRef.current.position.lerp(
        isExploded
          ? GUITAR_EXPLODED_CONFIG.outputJack.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
  });

  const { nodes, materials } = useGLTF(
    assetPaths.guitar,
  ) as unknown as GuitarGLTFResult;
  return (
    <group {...props} dispose={null}>
      <group name="Scene" ref={sceneRef}>
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
            offset={GUITAR_EXPLODED_CONFIG.body.label}
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
              offset={GUITAR_EXPLODED_CONFIG.cover.label}
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
              offset={GUITAR_EXPLODED_CONFIG.neck.label}
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
              offset={GUITAR_EXPLODED_CONFIG.outputJack.label}
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
              offset={GUITAR_EXPLODED_CONFIG.pickups.label}
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
              offset={GUITAR_EXPLODED_CONFIG.bridge.label}
              geometry={nodes.termoloArmAndBridge.geometry}
            />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(assetPaths.guitar);
