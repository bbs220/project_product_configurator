import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { JSX } from "react";
import { assetPaths } from "@/lib/utils";
import { WatchGLTFResult } from "@/types/models";
import { PartLabel } from "@/lib/PartLabel";

// EDIT THESE VALUES TO PERFECTLY POSITION PARTS AND LABELS IN THE EXPLODED VIEW
export const WATCH_EXPLODED_CONFIG = {
  chassis: {
    part: new THREE.Vector3(0, 0, 0),
    label: [0, 2, 0] as [number, number, number],
  },
  band: {
    part: new THREE.Vector3(-4, 0, 0),
    label: [-0.6, 2, 0] as [number, number, number],
  },
  backPlate: {
    part: new THREE.Vector3(4, 0, 0),
    label: [0.2, 1, 0] as [number, number, number],
  },
  screen: {
    part: new THREE.Vector3(-2, 0, 0),
    label: [0, 2, 0] as [number, number, number],
  },
  internals: {
    part: new THREE.Vector3(2, 0, 0),
    label: [0.2, 1, 0] as [number, number, number],
  },
  crown: {
    part: new THREE.Vector3(-2.5, 0, 0),
    label: [-0.2, 1, 0] as [number, number, number],
  },
};

// display labels mapped to mesh names
export const WATCH_LABELS = {
  watchChassis: "Case",
  watchBackPlate: "Back Plate",
  watchBand: "Band",
  watchCrown: "Digital Crown",
  watchInternals: "Internals",
  watchScreenBezel: "Display",
} as const;

export function WatchModel(props: JSX.IntrinsicElements["group"]) {
  const { isExploded, showLabels, watchMaterials } = useConfiguratorStore();
  const sceneRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Mesh>(null);
  const bandRef = useRef<THREE.Mesh>(null);
  const backPlateRef = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const internalsRef = useRef<THREE.Group>(null);
  const crownRef = useRef<THREE.Mesh>(null);

  const { nodes, materials } = useGLTF(
    assetPaths.watch,
  ) as unknown as WatchGLTFResult;

  // cloned materials for isolated category customization
  const customMaterials = useMemo(
    () => ({
      case: materials.edhWAPEBZsqCLTg.clone(),
      bezel: materials.GXPSJdzybTrBefY.clone(),
      band: materials.FsJfKVbzNLXJeBa.clone(),
      crown: materials.GvXrALMIeaGmIJo.clone(),
      face: materials.edYkGGAdRWeopLP.clone(),
      back: materials.YtajTVWccmKRZBL.clone(),
    }),
    [materials],
  );

  useFrame((state, delta) => {
    const speed = 4 * delta;

    if (sceneRef.current) {
      sceneRef.current.position.lerp(
        new THREE.Vector3(0, isExploded ? 2.5 : 0, 0),
        speed,
      );
    }

    if (chassisRef.current) {
      chassisRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.chassis.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
    if (bandRef.current) {
      bandRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.band.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
    if (backPlateRef.current) {
      backPlateRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.backPlate.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
    if (screenRef.current) {
      screenRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.screen.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
    if (internalsRef.current) {
      internalsRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.internals.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
    if (crownRef.current) {
      crownRef.current.position.lerp(
        isExploded
          ? WATCH_EXPLODED_CONFIG.crown.part
          : new THREE.Vector3(0, 0, 0),
        speed,
      );
    }
  });

  return (
    <group {...props} dispose={null}>
      <group name="Scene" ref={sceneRef}>
        <mesh
          ref={chassisRef}
          name="watchChassis"
          castShadow
          receiveShadow
          geometry={nodes.watchChassis.geometry}
          material={customMaterials.case}
          material-color={watchMaterials.case.color}
          material-roughness={watchMaterials.case.roughness}
          material-metalness={watchMaterials.case.metalness}
        >
          <PartLabel
            show={showLabels && isExploded}
            title={WATCH_LABELS.watchChassis}
            offset={WATCH_EXPLODED_CONFIG.chassis.label}
            geometry={nodes.watchChassis.geometry}
          />
          <mesh
            ref={backPlateRef}
            name="watchBackPlate"
            castShadow
            receiveShadow
            geometry={nodes.watchBackPlate.geometry}
            material={customMaterials.back}
            material-color={watchMaterials.back.color}
            material-roughness={watchMaterials.back.roughness}
            material-metalness={watchMaterials.back.metalness}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={WATCH_LABELS.watchBackPlate}
              offset={WATCH_EXPLODED_CONFIG.backPlate.label}
              geometry={nodes.watchBackPlate.geometry}
            />
            <mesh
              name="watchBackPlateAccents"
              castShadow
              receiveShadow
              geometry={nodes.watchBackPlateAccents.geometry}
              material={materials.JlRKetQcktLwJwa}
            />
            <mesh
              name="watchBackPlateHighlightRing"
              castShadow
              receiveShadow
              geometry={nodes.watchBackPlateHighlightRing.geometry}
              material={materials.CdZJpyOXLDMygZg}
            />
            <mesh
              name="watchBackPlateScrews"
              castShadow
              receiveShadow
              geometry={nodes.watchBackPlateScrews.geometry}
              material={materials.edhWAPEBZsqCLTg}
            />
            <mesh
              name="watchBackPlateScrewsCover"
              castShadow
              receiveShadow
              geometry={nodes.watchBackPlateScrewsCover.geometry}
              material={materials.JSFaTttTQosHtdR}
            />
            <mesh
              name="watchBackPlateText"
              castShadow
              receiveShadow
              geometry={nodes.watchBackPlateText.geometry}
              material={materials.hSvQcziHKpXubDY}
            />
            <mesh
              name="watchHearBeatSensorCover"
              castShadow
              receiveShadow
              geometry={nodes.watchHearBeatSensorCover.geometry}
              material={materials.IsuszdatyklnjoT}
            >
              <mesh
                name="watchHearBeatSensorAssembly"
                castShadow
                receiveShadow
                geometry={nodes.watchHearBeatSensorAssembly.geometry}
                material={materials.IvaXKlaVZetAvuj}
              />
              <mesh
                name="watchHearBeatSensorHalfRing"
                castShadow
                receiveShadow
                geometry={nodes.watchHearBeatSensorHalfRing.geometry}
                material={materials.CevCCqOWPSfMvyq}
              />
              <mesh
                name="watchHeartBeatSensorRingsA"
                castShadow
                receiveShadow
                geometry={nodes.watchHeartBeatSensorRingsA.geometry}
                material={materials.boERCOkfaeYKPmb}
              />
              <mesh
                name="watchHeartBeatSensorRingsB"
                castShadow
                receiveShadow
                geometry={nodes.watchHeartBeatSensorRingsB.geometry}
                material={materials.dSEglLtoqwjlQIP}
              />
            </mesh>
          </mesh>
          <mesh
            name="watchBackPlate001"
            castShadow
            receiveShadow
            geometry={nodes.watchBackPlate001.geometry}
            material={materials.CdZJpyOXLDMygZg}
          />
          <mesh
            ref={bandRef}
            name="watchBand"
            castShadow
            receiveShadow
            geometry={nodes.watchBand.geometry}
            material={customMaterials.band}
            material-color={watchMaterials.band.color}
            material-roughness={watchMaterials.band.roughness}
            material-metalness={watchMaterials.band.metalness}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={WATCH_LABELS.watchBand}
              offset={WATCH_EXPLODED_CONFIG.band.label}
              geometry={nodes.watchBand.geometry}
            />
            <mesh
              name="watchBandExtraStitch"
              castShadow
              receiveShadow
              geometry={nodes.watchBandExtraStitch.geometry}
              material={materials.troyYZUIqRYbiDX}
            />
            <mesh
              name="watchBandGrip"
              castShadow
              receiveShadow
              geometry={nodes.watchBandGrip.geometry}
              material={materials.ivgxAOQoWknkmNj}
            />
            <mesh
              name="watchBandGrip001"
              castShadow
              receiveShadow
              geometry={nodes.watchBandGrip001.geometry}
              material={materials.sTxeXXVKohXeDJU}
            />
            <mesh
              name="watchBandGrip002"
              castShadow
              receiveShadow
              geometry={nodes.watchBandGrip002.geometry}
              material={materials.lgIBGhMXHpTEcfq}
            />
          </mesh>
          <mesh
            name="watchChassisAccentLine"
            castShadow
            receiveShadow
            geometry={nodes.watchChassisAccentLine.geometry}
            material={materials.PmrTDgoSkxCPUel}
          />
          <mesh
            name="watchChassisAccentLines"
            castShadow
            receiveShadow
            geometry={nodes.watchChassisAccentLines.geometry}
            material={materials.YtajTVWccmKRZBL}
          />
          <mesh
            name="watchChassisBezel"
            castShadow
            receiveShadow
            geometry={nodes.watchChassisBezel.geometry}
            material={customMaterials.bezel}
            material-color={watchMaterials.case.color}
            material-roughness={watchMaterials.case.roughness}
            material-metalness={watchMaterials.case.metalness}
          />
          <mesh
            ref={crownRef}
            name="watchCrown"
            castShadow
            receiveShadow
            geometry={nodes.watchCrown.geometry}
            material={customMaterials.crown}
            material-color={watchMaterials.crown.color}
            material-roughness={watchMaterials.crown.roughness}
            material-metalness={watchMaterials.crown.metalness}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={WATCH_LABELS.watchCrown}
              offset={WATCH_EXPLODED_CONFIG.crown.label}
              geometry={nodes.watchCrown.geometry}
            />
            <mesh
              name="watchCrownAccentRing"
              castShadow
              receiveShadow
              geometry={nodes.watchCrownAccentRing.geometry}
              material={materials.VJcIxaYCeMHzzAJ}
            >
              <mesh
                name="watchCrownAccentRingHighlight"
                castShadow
                receiveShadow
                geometry={nodes.watchCrownAccentRingHighlight.geometry}
                material={materials.vqobCvtAVyNLbeh}
              />
            </mesh>
            <mesh
              name="watchCrownGrip"
              castShadow
              receiveShadow
              geometry={nodes.watchCrownGrip.geometry}
              material={materials.KjETpDnldvdbNBw}
            />
            <mesh
              name="watchCrownHead"
              castShadow
              receiveShadow
              geometry={nodes.watchCrownHead.geometry}
              material={customMaterials.crown}
              material-color={watchMaterials.crown.color}
              material-roughness={watchMaterials.crown.roughness}
              material-metalness={watchMaterials.crown.metalness}
            />
          </mesh>
          <mesh
            name="watchCrownAccentSupport"
            castShadow
            receiveShadow
            geometry={nodes.watchCrownAccentSupport.geometry}
            material={materials.LMTUXYhSYYJrnsy_0}
          />
          <mesh
            name="watchCrownSideButton"
            castShadow
            receiveShadow
            geometry={nodes.watchCrownSideButton.geometry}
            material={materials.edhWAPEBZsqCLTg}
          >
            <mesh
              name="watchCrownSideButtonRing"
              castShadow
              receiveShadow
              geometry={nodes.watchCrownSideButtonRing.geometry}
              material={materials.gYvxxOpBYwEcvOZ}
            />
          </mesh>
          <group ref={internalsRef}>
            <PartLabel
              show={showLabels && isExploded}
              title={WATCH_LABELS.watchInternals}
              offset={WATCH_EXPLODED_CONFIG.internals.label}
              geometry={nodes.watchInternalsA.geometry}
            />
            <mesh
              name="watchInternalsA"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsA.geometry}
              material={materials.AGtKlWnOInmqNQI}
            />
            <mesh
              name="watchInternalsB"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsB.geometry}
              material={materials.yKAKXxwHUkGVYpC}
            />
            <mesh
              name="watchInternalsC"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsC.geometry}
              material={materials.gYvxxOpBYwEcvOZ}
            />
            <mesh
              name="watchInternalsD"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsD.geometry}
              material={materials.ihcWbztBiuXfzKC}
            />
            <mesh
              name="watchInternalsE"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsE.geometry}
              material={materials.VkUcBAhoopQFcky}
            />
            <mesh
              name="watchInternalsF"
              castShadow
              receiveShadow
              geometry={nodes.watchInternalsF.geometry}
              material={materials.ICUREbcRKnCadKa}
            />
          </group>
          <mesh
            name="watchLowerStrapConnector"
            castShadow
            receiveShadow
            geometry={nodes.watchLowerStrapConnector.geometry}
            material={customMaterials.case}
            material-color={watchMaterials.case.color}
            material-roughness={watchMaterials.case.roughness}
            material-metalness={watchMaterials.case.metalness}
          />
          <mesh
            name="watchOtherSideButton"
            castShadow
            receiveShadow
            geometry={nodes.watchOtherSideButton.geometry}
            material={materials.NfRpqTxrWQxoAIy}
          />
          <mesh
            ref={screenRef}
            name="watchScreenBezel"
            castShadow
            receiveShadow
            geometry={nodes.watchScreenBezel.geometry}
            material={materials.EbFYvXZFEOELnji}
          >
            <PartLabel
              show={showLabels && isExploded}
              title={WATCH_LABELS.watchScreenBezel}
              offset={WATCH_EXPLODED_CONFIG.screen.label}
              geometry={nodes.watchScreenBezel.geometry}
            />
            <mesh
              name="watchScreen"
              castShadow
              receiveShadow
              geometry={nodes.watchScreen.geometry}
              material={customMaterials.face}
              material-color={watchMaterials.face.color}
              material-roughness={watchMaterials.face.roughness}
              material-metalness={watchMaterials.face.metalness}
            />
          </mesh>
          <mesh
            name="watchSpeakers"
            castShadow
            receiveShadow
            geometry={nodes.watchSpeakers.geometry}
            material={materials.yXTwmSCvToGuMDP}
          />
          <mesh
            name="watchUpperStrapConnector"
            castShadow
            receiveShadow
            geometry={nodes.watchUpperStrapConnector.geometry}
            material={customMaterials.case}
            material-color={watchMaterials.case.color}
            material-roughness={watchMaterials.case.roughness}
            material-metalness={watchMaterials.case.metalness}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(assetPaths.watch);
