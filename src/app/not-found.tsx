import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-8xl font-bold tracking-tighter text-gray-200 dark:text-gray-800">
        404
      </h1>
      <h2 className="text-2xl font-semibold mt-4 tracking-tight">
        Page not found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        {`The configuration or page you are looking for doesn't exist or has been moved.`}
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
