import React from "react";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface PlanHeaderProps {
  selectedPlanName: string | null | undefined;
  onPrevPlan: () => void;
  onNextPlan: () => void;
  onToggleSidebar: () => void;
  onSelectOverview: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  selectedPlanName,
  onPrevPlan,
  onNextPlan,
  onToggleSidebar,
  onSelectOverview,
  isPrevDisabled,
  isNextDisabled,
}) => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center shadow-lg shadow-cyan-500/20 w-full">
      <div className="flex items-center space-x-4">
        <button
          aria-label="Toggle sidebar"
          className="md:hidden text-white p-2"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent font-bold text-lg sm:text-xl md:text-2xl">
          {selectedPlanName ? `Plan: ${selectedPlanName}` : "Plans Dashboard"}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          aria-label="Previous plan"
          className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 transition-colors p-2"
          disabled={isPrevDisabled}
          onClick={onPrevPlan}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          aria-label="Next plan"
          className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 transition-colors p-2"
          disabled={isNextDisabled}
          onClick={onNextPlan}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        <button
          aria-label="View overview of all plans"
          className="bg-cyan-500 text-white rounded-full px-4 py-2 text-sm hover:bg-cyan-600 transition-all duration-300"
          onClick={onSelectOverview}
        >
          Overview
        </button>
      </div>
    </nav>
  );
};

export default PlanHeader;
