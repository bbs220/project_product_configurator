import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { JSX, useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { assetPaths } from "@/lib/utils";
import { GuitarGLTFResult } from "@/types/models";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { PartLabel } from "@/lib/PartLabel";

export const GUITAR_EXPLODED_CONFIG = {
  body: {
    part: new THREE.Vector3(0, 0, 0),
    label: [0, 0.8, 0] as [number, number, number],
  },
  cover: {
    part: new THREE.Vector3(2, 0.5, 0),
    label: [0.1, 0.6, 0] as [number, number, number],
  },
  neck: {
    part: new THREE.Vector3(1, 0, 0),
    label: [0, -1.6, 0] as [number, number, number],
  },
  pickups: {
    part: new THREE.Vector3(-2, 0, 0),
    label: [-0.1, 0.5, 0] as [number, number, number],
  },
  bridge: {
    part: new THREE.Vector3(3, 0, 0),
    label: [0.1, 0.5, 0] as [number, number, number],
  },
  outputJack: {
    part: new THREE.Vector3(-1, 0, 0),
    label: [-0.1, 0.5, 0] as [number, number, number],
  },
};

// display labels mapped to mesh names
export const GUITAR_LABELS = {
  body: "Body",
  cover: "Pickguard",
  neck: "Neck & Head",
  pickups: "Pickups",
  bridge: "Tremolo & Bridge",
  outputJack: "Output Jack",
} as const;

// custom cloned materials for guitar configuration
type CustomGuitarMaterials = {
  pickguard: THREE.MeshPhysicalMaterial;
  fretboard: THREE.MeshPhysicalMaterial;
  pickups: THREE.MeshPhysicalMaterial;
  knobs: THREE.MeshPhysicalMaterial;
};

// apply customized colors roughness and metalness to guitar materials
function applyGuitarMaterialProperties(
  materials: GuitarGLTFResult["materials"],
  customMaterials: CustomGuitarMaterials,
  guitarMaterials: ReturnType<typeof useConfiguratorStore.getState>["guitarMaterials"],
) {
  // body customization
  materials.BodyMaterial.color.set(guitarMaterials.body.color);
  materials.BodyMaterial.roughness = guitarMaterials.body.roughness;
  materials.BodyMaterial.metalness = guitarMaterials.body.metalness;

  // neck customization
  materials.NeckMaterial.color.set(guitarMaterials.neck.color);
  materials.NeckMaterial.roughness = guitarMaterials.neck.roughness;
  materials.NeckMaterial.metalness = guitarMaterials.neck.metalness;

  // hardware customization
  materials.MetalPartsMaterial.color.set(guitarMaterials.hardware.color);
  materials.MetalPartsMaterial.roughness = guitarMaterials.hardware.roughness;
  materials.MetalPartsMaterial.metalness = guitarMaterials.hardware.metalness;

  // pickguard customization
  customMaterials.pickguard.color.set(guitarMaterials.pickguard.color);
  customMaterials.pickguard.roughness = guitarMaterials.pickguard.roughness;
  customMaterials.pickguard.metalness = guitarMaterials.pickguard.metalness;

  materials.white.color.set(guitarMaterials.pickguard.color);
  materials.white.roughness = guitarMaterials.pickguard.roughness;
  materials.white.metalness = guitarMaterials.pickguard.metalness;

  // fretboard customization
  customMaterials.fretboard.color.set(guitarMaterials.fretboard.color);
  customMaterials.fretboard.roughness = guitarMaterials.fretboard.roughness;
  customMaterials.fretboard.metalness = guitarMaterials.fretboard.metalness;

  // pickups customization
  customMaterials.pickups.color.set(guitarMaterials.pickups.color);
  customMaterials.pickups.roughness = guitarMaterials.pickups.roughness;
  customMaterials.pickups.metalness = guitarMaterials.pickups.metalness;

  // knobs customization
  customMaterials.knobs.color.set(guitarMaterials.knobs.color);
  customMaterials.knobs.roughness = guitarMaterials.knobs.roughness;
  customMaterials.knobs.metalness = guitarMaterials.knobs.metalness;
}

export function GuitarModel(props: JSX.IntrinsicElements["group"]) {
  const { isExploded, showLabels, guitarMaterials } = useConfiguratorStore();
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

  // cloned materials for guitar pickguard and plastics
  const customMaterials = useMemo(
    () => ({
      pickguard: materials.NeckMaterial.clone(),
      fretboard: materials.NeckMaterial.clone(),
      pickups: materials.NeckMaterial.clone(),
      knobs: materials.NeckMaterial.clone(),
    }),
    [materials],
  );

  useEffect(() => {
    // update all guitar materials via external helper
    applyGuitarMaterialProperties(materials, customMaterials, guitarMaterials);
  }, [guitarMaterials, materials, customMaterials]);

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
            title={GUITAR_LABELS.body}
            offset={GUITAR_EXPLODED_CONFIG.body.label}
            geometry={nodes.body.geometry}
          />
          <mesh
            ref={coverRef}
            name="bodyCover"
            castShadow
            receiveShadow
            geometry={nodes.bodyCover.geometry}
            material={customMaterials.pickguard}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={GUITAR_LABELS.cover}
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
              material={customMaterials.knobs}
            />
            <mesh
              name="toneControlB"
              castShadow
              receiveShadow
              geometry={nodes.toneControlB.geometry}
              material={customMaterials.knobs}
            />
            <mesh
              name="volumeControl"
              castShadow
              receiveShadow
              geometry={nodes.volumeControl.geometry}
              material={customMaterials.knobs}
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
              title={GUITAR_LABELS.neck}
              offset={GUITAR_EXPLODED_CONFIG.neck.label}
              geometry={nodes.neakHead.geometry}
            />
            <mesh
              name="frets"
              castShadow
              receiveShadow
              geometry={nodes.frets.geometry}
              material={customMaterials.fretboard}
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
              title={GUITAR_LABELS.outputJack}
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
            material={customMaterials.pickups}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={GUITAR_LABELS.pickups}
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
              material={customMaterials.knobs}
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
              title={GUITAR_LABELS.bridge}
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
