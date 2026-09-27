const Floor = () => {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color={"#404040"} />
      </mesh>
    </group>
  );
};
export default Floor;
