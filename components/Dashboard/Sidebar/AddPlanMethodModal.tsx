import React from "react";

import GenericModal from "@/components/Common/GenericModal";

interface AddPlanMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodSelect: (method: string) => void;
}

const AddPlanMethodModal: React.FC<AddPlanMethodModalProps> = ({
  isOpen,
  onClose,
  onMethodSelect,
}) => {
  const handleMethodSelect = (method: string) => {
    onMethodSelect(method);
    onClose();
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-color-15 font-sans p-4 sm:p-6">
        <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-1">
          Choose a Method to Add Plan
        </h2>
        <div className="transition-all duration-300 flex flex-col gap-4">
          <button
            className="w-full bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-9 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("custom")}
          >
            Customize By Form Data
          </button>
          <button
            className="w-full bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-9 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("select-subjects")}
          >
            Choose From System Data
          </button>
          <button
            className="w-full bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-9 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("import-json")}
          >
            Customize By Importing JSON
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddPlanMethodModal;
