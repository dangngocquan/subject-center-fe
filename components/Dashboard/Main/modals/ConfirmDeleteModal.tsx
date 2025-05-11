import React from "react";

import GenericModal from "@/components/Common/GenericModal";

const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subjectName: string;
}> = ({ isOpen, onClose, onConfirm, subjectName }) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose} className="w-[200px]">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-color-15 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-color-15 mb-6">
          Are you sure you want to delete the subject{" "}
          <span className="font-semibold text-color-R5">{subjectName}</span>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-color-6 text-color-15 rounded-full px-4 py-2 hover:bg-color-9 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-color-R7 text-color-15 rounded-full px-4 py-2 hover:bg-color-R7 transition-all duration-300"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ConfirmDeleteModal;
