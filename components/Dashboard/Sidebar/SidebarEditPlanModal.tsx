// SidebarEditPlanModal.tsx
import React from "react";
import { motion } from "framer-motion";

import GenericModal from "../../Common/GenericModal";

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

  return (
    <GenericModal
      className="w-100% fixed pl-0"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h3 className="text-xl font-semibold text-color-15 mb-4 text-center">
        Edit Plan Name
      </h3>
      <input
        className="w-full border border-color-15 bg-color-1 text-color-15 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-color-6"
        placeholder="Enter new name..."
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <div className="flex justify-around gap-2">
        <motion.button
          className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-R6 transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Cancel
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-G6 transition-all duration-200 text-sm font-medium"
          disabled={newName.trim() === ""}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
        >
          Submit
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default EditPlanModal;
