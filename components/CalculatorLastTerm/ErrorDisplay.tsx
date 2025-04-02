import React from "react";

interface ErrorDisplayProps {
  errors: string[];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
      <h3 className="font-semibold mb-2">Input Errors:</h3>
      <ul className="list-disc pl-5">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorDisplay;
