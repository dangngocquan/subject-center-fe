import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  result,
}) => {

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="bg-[#1A2A44] p-6 rounded-lg shadow-xl w-full max-w-md relative"
        style={{ background: "rgba(26, 42, 68, 0.95)" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          onClick={onClose}
        >
          <FaTimes size={16} />
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">
          Kết quả tạo Plan
        </h3>

        {result.length === 0 ? (
          <p className="text-gray-300 text-sm">
            Không có kết quả đến hiện tại.
          </p>
        ) : (
          <div className="text-sm max-h-40 overflow-y-auto">
            <ul className="space-y-1">
              {result.map((item, index) => (
                <li
                  key={index}
                  className={
                    item.status === "SUCCEEDED"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  - {item.code}: {item.message}
                </li>
              ))}
            </ul>
          </div>
        )}

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
      </motion.div>
    </div>
  );
};

export default ResultModal;
