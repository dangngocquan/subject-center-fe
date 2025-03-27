import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

import GenericModal from "../Common/GenericModal"; // Import GenericModal

import { siteConfig } from "@/config/site";
// Import GenericButton

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  result: {
    name: string;
    code: string;
    status: "SUCCEEDED" | "FAILED";
    message: string;
  }[];
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  planName,
  result,
}) => {
  if (!isOpen) return null;

  const succeededCount = result.filter(
    (item) => item.status === "SUCCEEDED",
  ).length;
  const failedCount = result.filter((item) => item.status === "FAILED").length;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      {/* Title */}
      <h3 className="text-2xl font-bold text-blue-400 mb-4 relative inline-block">
        Plan Creation Results
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full" />
      </h3>
      {/* Statistics */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-sm justify-center justify-between">
        <div className="flex flex-col items-center p-3 bg-green-900/30 rounded-lg">
          <span className="text-gray-300">Successful Subjects</span>
          <span className="text-green-400 font-semibold text-lg">
            {succeededCount}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-900/30 rounded-lg">
          <span className="text-gray-300">Failed Subjects</span>
          <span className="text-red-400 font-semibold text-lg">
            {failedCount}
          </span>
        </div>
      </div>
      {/* Content */}
      {result.length === 0 ? (
        <p className="text-gray-300 text-sm">
          No results available at the moment.
        </p>
      ) : (
        <div className="text-sm max-h-60 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#4A90E2] scrollbar-track-[#2A3A54] scrollbar-thumb-rounded">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Table header */}
            <thead style={{ backgroundColor: "#2A3A54" }}>
              <tr>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "40%" }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "20%" }}
                >
                  Code
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "40%" }}
                >
                  Message
                </th>
              </tr>
            </thead>
            {/* Table content */}
            <tbody className="divide-y divide-gray-700">
              {result.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    item.status === "SUCCEEDED"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  } hover:bg-[#2A3A54]`}
                >
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.code}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.message || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <Link
          passHref
          href={`${siteConfig.routers.planDetails(String(planName))}`}
        >
          <motion.button
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </Link>
      </div>
    </GenericModal>
  );
};

export default ResultModal;
