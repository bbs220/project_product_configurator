import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { savedConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Car, Settings, Plus } from "lucide-react";
import Image from "next/image";

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const configs = await db
    .select()
    .from(savedConfigs)
    .where(eq(savedConfigs.clerkUserId, userId));

  return (
    <div className="w-full min-h-[calc(100vh-64px)] pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            My Garage
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View and manage your saved vehicle configurations.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {configs.length === 0 ? (
        <div className="w-full h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center p-6">
          <Car className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your garage is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {`You haven't saved any configurations yet. Head over to the dashboard to start customizing a new vehicle.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {configs.map((config) => (
            <div
              key={config.id}
              className="group rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white"
            >
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
                {config.thumbnailUrl ? (
                  <Image
                    src={config.thumbnailUrl}
                    alt={`Saved ${config.modelType}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Car className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {config.modelType}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Saved {new Date(config.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <Link
                  href={`/configurator?model=${config.modelType}&id=${config.id}`}
                  className="w-full block text-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Load Configuration
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
