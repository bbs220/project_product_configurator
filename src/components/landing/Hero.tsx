import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full max-w-7xl px-6 md:px-12 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
        Shape your vision.
        <br />
        Realize your product.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
        The next-generation 3D product configurator. Customize, visualize, and
        export photorealistic models in real-time, directly from your browser.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Launch Configurator
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="#features"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Explore Features
        </Link>
      </div>
    </section>
  );
}
