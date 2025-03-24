import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

import GenericModal from "../Common/GenericModal"; // Import GenericModal
import { GenericButton } from "../Common/GenericButton"; // Import GenericButton

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
    (item) => item.status === "SUCCEEDED"
  ).length;
  const failedCount = result.filter((item) => item.status === "FAILED").length;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      {/* Nút "X" để đóng */}
      <GenericButton
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        tooltipContent="Đóng"
        tooltipId="close-tooltip"
        onClick={onClose}
      >
        <FaTimes size={16} />
      </GenericButton>

      {/* Tiêu đề */}
      <h3 className="text-xl font-semibold text-white mb-2">
        Kết quả tạo Plan
      </h3>

      {/* Thống kê */}
      <div className="text-sm text-gray-300 mb-4">
        Tên plan: <span className="text-white">{planName}</span> | Số môn thành
        công: <span className="text-green-400">{succeededCount}</span> | Số môn
        thất bại: <span className="text-red-400">{failedCount}</span>
      </div>

      {/* Nội dung */}
      {result.length === 0 ? (
        <p className="text-gray-300 text-sm">Không có kết quả đến hiện tại.</p>
      ) : (
        <div className="text-sm max-h-60 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#4A90E2] scrollbar-track-[#2A3A54] scrollbar-thumb-rounded">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Tiêu đề bảng */}
            <thead style={{ backgroundColor: "#2A3A54" }}>
              <tr>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "40%" }}
                >
                  Tên
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "20%" }}
                >
                  Mã
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "40%" }}
                >
                  Message
                </th>
              </tr>
            </thead>
            {/* Nội dung bảng */}
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

      {/* Nút "Đóng" */}
      <div className="flex justify-end mt-4">
        <motion.button
          className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Đóng
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ResultModal;
