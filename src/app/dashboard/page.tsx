import ModelGrid from "@/components/dashboard/ModelGrid";

export default function Dashboard() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
          Select a Model
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Choose a base vehicle to begin configuration.
        </p>

        <ModelGrid />
      </div>
    </div>
  );
}
