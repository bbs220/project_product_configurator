import { Layers, Zap, Download } from "lucide-react";

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="w-full max-w-7xl px-6 md:px-12 py-24 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <Layers className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Modular Design</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Swap materials, alter geometries, and construct your perfect product
            piece by piece with our intuitive sidebar.
          </p>
        </div>

        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Real-time Rendering</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Experience zero lag. Our WebGL engine delivers stunning 60FPS 3D
            rendering with dynamic lighting and shadows.
          </p>
        </div>

        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <Download className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Instant Export</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Generate PDF summaries, grab high-resolution screenshots, and sync
            your configuration instantly to the checkout.
          </p>
        </div>
      </div>
    </section>
  );
}
