import PrimaryCanvas from "@/components/scene/PrimaryCanvas";

const Configurator = () => {
  return (
    <div className="w-full h-[calc(100dvh-64px)] mt-16 relative overflow-hidden">
      <PrimaryCanvas />
    </div>
  );
};
export default Configurator;
