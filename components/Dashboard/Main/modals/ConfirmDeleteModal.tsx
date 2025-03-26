import React from "react";

import GenericModal from "@/components/Common/GenericModal";

const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subjectName: string;
}> = ({ isOpen, onClose, onConfirm, subjectName }) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the subject{" "}
          <span className="font-semibold text-cyan-400">{subjectName}</span>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-600 text-white rounded-full px-4 py-2 hover:bg-gray-500 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition-all duration-300"
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
