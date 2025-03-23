// SidebarConfirmDeleteModal.tsx
import React from "react";
import { motion } from "framer-motion";

import GenericModal from "../../Common/GenericModal";

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
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold text-white mb-4">
        Confirm Deletion
      </h3>
      <p className="text-white mb-6">
        Are you sure you want to delete this plan? This action cannot be undone.
      </p>
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
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
        >
          Delete
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default ConfirmDeleteModal;
