import React from "react";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error?: Error;
  resetErrorBoundary?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-yellow-100">
    <div className="mb-6">
      <svg
        className="h-20 w-20 text-red-500 animate-bounce"
        fill="none"
        viewBox="0 0 48 48"
      >
        <circle
          className="opacity-30"
          cx="24"
          cy="24"
          r="22"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M24 12a2 2 0 0 1 2 2v12a2 2 0 1 1-4 0V14a2 2 0 0 1 2-2zm0 22a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
        />
      </svg>
    </div>
    <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
    <p className="text-gray-600 mb-4">
      {error?.message || "An unexpected error occurred. Please try again later."}
    </p>
    {resetErrorBoundary && (
      <button
        className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorFallback;
