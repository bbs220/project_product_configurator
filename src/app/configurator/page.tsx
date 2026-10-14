import { Suspense } from "react";
import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";
import CanvasControls from "@/components/configurator/CanvasControls";

// wrap client components using search params in suspense boundary for static export
const Configurator = () => {
  return (
    <div className="w-full h-[calc(100dvh-64px)] mt-16 relative overflow-hidden">
      <Suspense fallback={null}>
        <PrimaryCanvas />
        <CanvasControls />
        <ConfiguratorSidebar />
      </Suspense>
    </div>
  );
};

export default Configurator;
