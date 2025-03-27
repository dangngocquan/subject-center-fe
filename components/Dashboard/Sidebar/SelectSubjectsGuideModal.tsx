import React from "react";

import GenericModal from "@/components/Common/GenericModal";

interface SelectSubjectsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

const SelectSubjectsGuideModal: React.FC<SelectSubjectsGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-white font-sans p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          How to Select Subjects
        </h2>
        <ol className="list-decimal list-inside space-y-4 text-sm sm:text-base">
          <li>After accessing the next page, you will see a list of majors.</li>
          <li>
            Choose a major you are pursuing or one that contains the subjects
            you want.
          </li>
          <li>
            When you click on a major&apos;s details, switch to &quot;Select
            Mode&quot; and pick the subjects you want.
          </li>
          <li>
            Once you&apos;ve selected your subjects, click &quot;Create New
            Plan,&quot; enter a plan name, and submit.
          </li>
        </ol>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 text-sm sm:text-base"
            onClick={onNavigate}
          >
            Go to Majors
          </button>
          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg px-4 py-3 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default SelectSubjectsGuideModal;
