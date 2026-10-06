import { Bike, Disc, Layers, Settings2 } from "lucide-react";

export const bikeTabs = [
  { id: "frame", label: "Frame", icon: Bike },
  { id: "wheels", label: "Wheels", icon: Disc },
  { id: "suspension", label: "Suspension", icon: Layers },
  { id: "drivetrain", label: "Drivetrain", icon: Settings2 },
];

export default function BikePanel({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
          {activeTab} Configuration
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Customize the mountain bike {activeTab} components.
        </p>
      </div>
      
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Controls coming soon...
      </div>
    </div>
  );
}

