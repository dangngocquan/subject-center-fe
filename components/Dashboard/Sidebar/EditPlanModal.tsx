// EditPlanModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  initialName: string;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
}) => {
  const [newName, setNewName] = React.useState(initialName);

  React.useEffect(() => {
    setNewName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    if (newName.trim() !== "") {
      onSubmit(newName.trim());
    }
    onClose();
  };

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
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
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
              Chỉnh sửa tên Plan
            </h3>

            {/* Input */}
            <input
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nhập tên mới..."
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            {/* Nút hành động */}
            <div className="flex justify-end gap-2">
              <motion.button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-all duration-200 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
                disabled={newName.trim() === ""}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
              >
                Submit
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditPlanModal;
