import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";

const Configurator = () => {
  return (
    <div className="w-full h-[calc(100dvh-64px)] mt-16 flex flex-row overflow-hidden">
      <ConfiguratorSidebar />
      <div className="relative flex-1 overflow-hidden">
        <PrimaryCanvas />
      </div>
    </div>
  );
};
export default Configurator;
