import { Suspense } from "react";
import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";

// wrap client components using search params in suspense boundary for static export
const Configurator = () => {
  return (
    <Suspense fallback={null}>
      <ConfiguratorLayout
        // interactive model viewport stage
        canvas={<PrimaryCanvas />}
        // customization studio options panel
        sidebar={<ConfiguratorSidebar />}
      />
    </Suspense>
  );
};

export default Configurator;
