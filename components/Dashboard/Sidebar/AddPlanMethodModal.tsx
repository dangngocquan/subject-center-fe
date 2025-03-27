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
      <div className="text-white font-sans p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Choose a Method to Add Plan
        </h2>
        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("custom")}
          >
            Create Custom Plan
          </button>
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("select-subjects")}
          >
            Select Subjects
          </button>
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm sm:text-base"
            onClick={() => handleMethodSelect("import-json")}
          >
            Import from JSON
          </button>
        </div>
        <button
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg px-4 py-3 mt-4 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md text-sm sm:text-base"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </GenericModal>
  );
};

export default AddPlanMethodModal;
