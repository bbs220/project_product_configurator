import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";
import CanvasControls from "@/components/configurator/CanvasControls";

const Configurator = () => {
  return (
    <div className="w-full h-[calc(100dvh-64px)] mt-16 relative overflow-hidden">
      <PrimaryCanvas />
      <CanvasControls />
      <ConfiguratorSidebar />
    </div>
  );
};
export default Configurator;
