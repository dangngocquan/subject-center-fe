// SidebarNotificationModal.tsx
import React from "react";

import GenericModal from "../../Common/GenericModal";

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
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <h3
        className={`text-xl font-semibold mb-4 ${
          isSuccess ? "text-green-400" : "text-red-400"
        }`}
      >
        {isSuccess ? "Success" : "Failure"}
      </h3>
      <p className="text-color-15 mb-6">{message}</p>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-[#4A90E2] text-color-15 rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </GenericModal>
  );
};

export default NotificationModal;
