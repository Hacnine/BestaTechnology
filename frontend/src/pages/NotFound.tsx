import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-9xl font-extrabold text-gray-300 animate-bounce">
        404
      </h1>
      <h2 className="text-3xl sm:text-4xl font-bold mt-4 text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mt-2">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
