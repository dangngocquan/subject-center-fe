// NotificationModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isSuccess: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  message,
  isSuccess,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="bg-[#1A2A44] p-6 rounded-lg shadow-xl w-full max-w-lg relative border border-[#2A3A54] backdrop-blur-sm"
            style={{ background: "rgba(26, 42, 68, 0.95)" }}
          >
            {/* Nút "X" để đóng */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              <FaTimes size={16} />
            </button>

            {/* Tiêu đề */}
            <h3
              className={`text-xl font-semibold mb-4 ${
                isSuccess ? "text-green-400" : "text-red-400"
              }`}
            >
              {isSuccess ? "Thành công" : "Thất bại"}
            </h3>

            {/* Nội dung */}
            <p className="text-white mb-6">{message}</p>

            {/* Nút "Đóng" */}
            <div className="flex justify-end">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
