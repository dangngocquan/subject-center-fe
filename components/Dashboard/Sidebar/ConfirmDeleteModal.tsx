// ConfirmDeleteModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
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
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate="visible"
            className="bg-[#1A2A44] p-6 rounded-lg shadow-xl w-full max-w-lg relative border border-[#2A3A54] backdrop-blur-sm"
            exit="exit"
            initial="hidden"
            style={{ background: "rgba(26, 42, 68, 0.95)" }}
            variants={modalVariants}
          >
            {/* Nút "X" để đóng */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              <FaTimes size={16} />
            </button>

            {/* Tiêu đề */}
            <h3 className="text-xl font-semibold text-white mb-4">
              Xác nhận xóa Plan
            </h3>

            {/* Nội dung */}
            <p className="text-white mb-6">
              Bạn có chắc muốn xóa plan này không? Hành động này không thể hoàn
              tác.
            </p>

            {/* Nút hành động */}
            <div className="flex justify-end gap-2">
              <motion.button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-all duration-200 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Hủy
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
              >
                Xóa
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
