import Link from "next/link";
import { Car } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
          Select a Model
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Choose a base vehicle to begin configuration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/configurator?model=veneno" className="group">
            <div className="w-full aspect-video rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white hover:-translate-y-1 hover:shadow-xl">
              <Car className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Lamborghini Veneno
              </h2>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                Start Project
              </p>
            </div>
          </Link>

          <Link href="/configurator?model=gt3" className="group">
            <div className="w-full aspect-video rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white hover:-translate-y-1 hover:shadow-xl">
              <Car className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Porsche 911 GT3
              </h2>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                Start Project
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
