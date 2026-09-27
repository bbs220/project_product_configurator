import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-8 md:px-12 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-md mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} forma. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/terms-of-service"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacypolicy"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
