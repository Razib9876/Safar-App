import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Go back home
        </Link>
      </div>

      {/* Divider */}
      <div className="mt-16 w-full max-w-xl relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-gray-100 dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">
            If this is a mistake, please contact support
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
