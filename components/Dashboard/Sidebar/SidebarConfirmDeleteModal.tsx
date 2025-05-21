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
      <h3 className="text-xl font-semibold text-color-15 mb-4 text-center">
        Confirm Deletion
      </h3>
      <p className="text-color-15 mb-6 text-center">
        Are you sure you want to delete this plan? This action cannot be undone.
      </p>
      <div className="flex justify-around gap-2">
        <motion.button
          className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-5 transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Cancel
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-R7 transition-all duration-200 text-sm font-medium"
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
