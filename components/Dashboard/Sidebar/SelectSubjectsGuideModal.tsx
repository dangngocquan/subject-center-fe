import React from "react";
import Link from "next/link";

import GenericModal from "@/components/Common/GenericModal";
import { siteConfig } from "@/config/site";

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
      <div className="text-color-15 font-sans p-4 sm:p-6">
        <h2 className=" text-center text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Guideline
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
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <Link
            className="text-center font-bold w-[100%] bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-9 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            href={`${siteConfig.routers.majors}`}
            onClick={onNavigate}
          >
            Go to Majors
          </Link>
        </div>
      </div>
    </GenericModal>
  );
};

export default SelectSubjectsGuideModal;
