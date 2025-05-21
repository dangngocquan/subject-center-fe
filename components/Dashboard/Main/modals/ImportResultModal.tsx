import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import GenericModal from "@/components/Common/GenericModal";
import { ResponseImportUpdateGradePlan } from "@/types/plan";

const ImportResultModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  result: ResponseImportUpdateGradePlan["result"];
}> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const updatedCount =
    result?.filter((item) => item.status === "UPDATED").length ?? 0;
  const newCount = result?.filter((item) => item.status === "NEW").length ?? 0;
  const failedCount =
    result?.filter((item) => item.status === "FAILED").length ?? 0;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <button
        className="absolute top-4 right-4 text-color-15 hover:text-color-15 transition-colors duration-200"
        onClick={onClose}
      >
        <FaTimes size={16} />
      </button>
      <h3 className="text-2xl font-bold text-color-15 mb-4 relative inline-block">
        Import Results
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-color-1 rounded-full" />
      </h3>
      <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col items-center p-3 bg-green-900/30 rounded-lg">
          <span className="text-color-15">New Subjects</span>
          <span className="text-green-400 font-semibold text-lg">
            {newCount}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-yellow-900/30 rounded-lg">
          <span className="text-color-15">Updated Subjects</span>
          <span className="text-yellow-400 font-semibold text-lg">
            {updatedCount}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-900/30 rounded-lg">
          <span className="text-color-15">Failed Subjects</span>
          <span className="text-red-400 font-semibold text-lg">
            {failedCount}
          </span>
        </div>
      </div>
      {result && result.length > 0 ? (
        <div className="text-sm max-h-60 overflow-y-auto overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead style={{ backgroundColor: "#2A3A54" }}>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-color-15 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-color-15 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-color-15 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-color-15 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {result.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    item.status === "NEW"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "UPDATED"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  } hover:bg-[#2A3A54]`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-color-15">
                    {item.name || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-color-15">
                    {item.code || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-color-15">
                    {item.gradeLatin || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-color-15">
                    {item.status || "-"}
                    {item.message && (
                      <span className="text-color-15"> ({item.message})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-color-15 text-sm">No results to display.</p>
      )}
      <div className="flex justify-end mt-4">
        <motion.button
          className="px-4 py-2 bg-[#4A90E2] text-color-15 rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Close
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ImportResultModal;
