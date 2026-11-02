import { Suspense } from "react";
import PrimaryCanvas from "@/components/scene/PrimaryCanvas";
import ConfiguratorSidebar from "@/components/configurator/ConfiguratorSidebar";

// wrap client components using search params in suspense boundary for static export
const Configurator = () => {
  return (
    <main className="w-full h-[calc(100dvh-64px)] mt-16 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-black">
      <Suspense fallback={null}>
        {/* interactive model viewport stage */}
        <section
          id="canvas-stage"
          className="relative w-full lg:w-3/5 h-1/2 lg:h-full flex-1 lg:flex-none overflow-hidden"
        >
          <PrimaryCanvas />
        </section>

        {/* customization studio options panel */}
        <section className="w-full lg:w-2/5 h-1/2 lg:h-full lg:flex-none border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-zinc-950/50 overflow-hidden">
          <ConfiguratorSidebar />
        </section>
      </Suspense>
    </main>
  );
};

export default Configurator;
