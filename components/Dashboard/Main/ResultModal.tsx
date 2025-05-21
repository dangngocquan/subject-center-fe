import React from "react";

import GenericModal from "@/components/Common/GenericModal";

interface ResultModalProps {
  isOpen: boolean;
  message: string;
  isError: boolean;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  message,
  isError,
  onClose,
}) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <p className={`text-lg ${isError ? "text-red-500" : "text-green-500"}`}>
        {message}
      </p>
      <button
        className="mt-4 bg-color-1 text-color-15 rounded-full px-4 py-2 hover:bg-color-6 transition-all duration-300"
        onClick={onClose}
      >
        Close
      </button>
    </GenericModal>
  );
};

export default ResultModal;
