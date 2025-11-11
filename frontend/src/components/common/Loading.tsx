import React from "react";

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
    <div className="relative flex items-center justify-center mb-6">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 border-opacity-30"></div>
      <div className="absolute">
        <svg
          className="h-12 w-12 text-blue-500 animate-pulse"
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
            d="M24 8a16 16 0 1 1-11.31 4.69l2.83 2.83A12 12 0 1 0 24 12V8z"
          />
        </svg>
      </div>
    </div>
    <h1 className="text-2xl font-bold text-blue-700 mb-2 animate-pulse">Loading...</h1>
    <p className="text-gray-500 text-sm">Please wait while we prepare your dashboard.</p>
  </div>
);

export default Loading;
