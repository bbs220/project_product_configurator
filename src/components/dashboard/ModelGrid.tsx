import Link from "next/link";
import { Car, Watch, Keyboard, Bike, Guitar, Box } from "lucide-react";
import { assetPaths } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  laFerrari: Car,
  watch: Watch,
  keyboard: Keyboard,
  mtBike: Bike,
  guitar: Guitar,
};

export default function ModelGrid() {
  const models = Object.entries(assetPaths).map(([key, path]) => {
    // path looks like "/models/Ferrari_LaFerrari_2013.glb"
    const filename = path.split("/").pop()?.replace(".glb", "") || "";
    const parts = filename.split("_");

    // fallback parsing just in case
    if (parts.length < 3) {
      return {
        key,
        brand: parts[0] || key,
        modelName: key,
        year: "",
      };
    }

    const brand = parts[0];
    const year = parts[parts.length - 1];
    const modelName = parts.slice(1, parts.length - 1).join(" ");

    return {
      key,
      brand,
      modelName,
      year,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map(({ key, brand, modelName, year }) => {
        const Icon = iconMap[key] || Box;
        
        return (
          <Link key={key} href={`/configurator?model=${key}`} className="group">
            <div className="w-full aspect-video rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                {brand}
              </div>
              <div className="absolute top-4 right-4 text-xs font-bold text-gray-400">
                {year}
              </div>

              <Icon className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" />

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 text-center">
                {modelName}
              </h2>

              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                Start Project
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
