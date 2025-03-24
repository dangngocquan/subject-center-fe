import React from "react";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"; // Đổi từ MenuIcon

interface PlanHeaderProps {
  selectedPlanName: string | null | undefined;
  onPrevPlan: () => void;
  onNextPlan: () => void;
  onToggleSidebar: () => void;
  onSelectOverview: () => void; // Add this prop
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  selectedPlanName,
  onPrevPlan,
  onNextPlan,
  onToggleSidebar,
  onSelectOverview, // Use the new prop
  isPrevDisabled,
  isNextDisabled,
}) => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center top-0 z-30 shadow-lg shadow-cyan-500/20 w-full">
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-white" onClick={onToggleSidebar}>
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent font-bold text-xl md:text-2xl">
          {selectedPlanName ? `Plan: ${selectedPlanName}` : "Plans Dashboard"}
        </div>
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <button
          className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 transition-colors"
          disabled={isPrevDisabled}
          onClick={onPrevPlan}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          className="text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 transition-colors"
          disabled={isNextDisabled}
          onClick={onNextPlan}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        <button
          aria-label="View overview of all plans"
          className="bg-cyan-500 text-white rounded-full px-4 py-2 text-sm md:text-base flex items-center gap-2 hover:bg-cyan-600 hover:scale-105 transition-all duration-300"
          onClick={onSelectOverview} // Call the correct function
        >
          Overview
        </button>
      </div>
    </nav>
  );
};

export default PlanHeader;
