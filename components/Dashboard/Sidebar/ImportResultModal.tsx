import React from "react";

import GenericModal from "@/components/Common/GenericModal";

interface ImportResult {
  plan: {
    id: string;
    name: string;
    accountId: string;
    items: any[];
  };
  result: {
    code: string;
    message: string;
    status: "FAILED" | "UPDATED" | "NEW" | "SUCCEEDED";
    name: string;
  }[];
}

interface ImportResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ImportResult | null;
}

const ImportPlanResultByJsonModal: React.FC<ImportResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;
  console.log({ result });

  const updatedCount =
    result?.result?.filter(
      (item) => item.status === "UPDATED" || item.status === "SUCCEEDED"
    ).length ?? 0;
  const newCount =
    result?.result?.filter((item) => item.status === "NEW").length ?? 0;
  const failedCount =
    result?.result?.filter((item) => item.status === "FAILED").length ?? 0;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-white font-sans p-4 sm:p-6">
        {/* Tiêu đề được thiết kế lại */}
        <h3 className="text-2xl font-bold text-blue-400 mb-4 relative inline-block">
          Import Results
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full" />
        </h3>
        {/* Tên kế hoạch được thiết kế lại */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-gray-300 text-sm font-medium">Plan Name:</span>
          <span className="text-white font-semibold bg-blue-900/30 px-3 py-1 rounded-md">
            {result?.plan?.name || "Unknown"}
          </span>
        </div>
        {/* Phần stats */}
        <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center p-3 bg-green-900/30 rounded-lg">
            <span className="text-gray-300">Updated Subjects</span>
            <span className="text-green-400 font-semibold text-lg">
              {updatedCount}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-yellow-900/30 rounded-lg">
            <span className="text-gray-300">New Subjects</span>
            <span className="text-yellow-400 font-semibold text-lg">
              {newCount}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-red-900/30 rounded-lg">
            <span className="text-gray-300">Failed Subjects</span>
            <span className="text-red-400 font-semibold text-lg">
              {failedCount}
            </span>
          </div>
        </div>
        {/* Phần bảng giữ nguyên */}
        {result?.result && result.result.length > 0 ? (
          <div className="text-sm max-h-60 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead style={{ backgroundColor: "#2A3A54" }}>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {result.result.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      item.status === "UPDATED" || item.status === "SUCCEEDED"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "NEW"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    } hover:bg-[#2A3A54]`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-white">
                      {item.name || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-white">
                      {item.code || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-white">
                      {item.status || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-white">
                      {item.message && (
                        <span className="text-gray-500"> ({item.message})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">No results to display.</p>
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportPlanResultByJsonModal;
