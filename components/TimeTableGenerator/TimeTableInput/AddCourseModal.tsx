// components/TimeTable/TimeTableInput/AddCourseModal.tsx
import React from "react";

import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustom: () => void;
  onJson: () => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onCustom,
  onJson,
}) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center text-color-1 font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Add New Course
        </h3>
        <p className="text-color-15 mb-6">Choose how to add a course:</p>
        <div className="flex justify-center space-x-4">
          <GenericButton onClick={onCustom}>Add Custom</GenericButton>
          <GenericButton onClick={onJson}>Import JSON</GenericButton>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddCourseModal;
