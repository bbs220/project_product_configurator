import { MeshReflectorMaterial } from "@react-three/drei";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

type FloorProps = {
  visible?: boolean;
};

// reflective ground plane displaying premium floor reflections
const Floor = ({ visible }: FloorProps) => {
  const storeShowFloor = useConfiguratorStore((state) => state.showFloor);
  const isVisible = visible !== undefined ? visible : storeShowFloor;

  if (!isVisible) {
    return null;
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <circleGeometry args={[1000, 10, 0, 6.3]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={80}
        roughness={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.5}
        mirror={0.7}
      />
    </mesh>
  );
};

export default Floor;
