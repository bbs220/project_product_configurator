import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";

const Configurator = () => {
  return (
    <div className="w-full h-[calc(100dvh-64px)] mt-16 relative overflow-hidden">
      <PrimaryCanvas />
      <ConfiguratorSidebar />
    </div>
  );
};
export default Configurator;
