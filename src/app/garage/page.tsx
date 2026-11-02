import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { savedConfigs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Box, Lock, LogIn, Plus } from "lucide-react";
import GarageCard from "@/components/garage/GarageCard";


// user garage management page
export default async function AccountPage() {
  const { userId } = await auth();

  // prompt unauthenticated visitors to sign in to access cloud garage
  if (!userId) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6 text-gray-700 dark:text-gray-300">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Sign in to use My Garage
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Your garage lets you store, update, and manage custom product variations. Please sign in to access your saved builds.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/sign-in"
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  // fetch user configurations ordered by most recent update
  const configs = await db
    .select()
    .from(savedConfigs)
    .where(eq(savedConfigs.clerkUserId, userId))
    .orderBy(desc(savedConfigs.updatedAt));

  return (
    <div className="w-full min-h-[calc(100vh-64px)] pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">


      {/* garage dashboard header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Garage
            </h1>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {configs.length} / 20 Builds
            </span>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400">
            View, inspect, and manage your saved custom 3D product variations.
          </p>
        </div>

        {/* new project action link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Build</span>
        </Link>
      </div>

      {/* empty garage state */}
      {configs.length === 0 ? (
        <div className="w-full h-80 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-600">
            <Box className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
            Your garage is empty
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            You have not saved any product variations yet. Head over to the studio to customize and save your first build.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Start Customizing</span>
          </Link>
        </div>
      ) : (
        /* saved configurations card grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {configs.map((config) => (
            <GarageCard key={config.id} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}
