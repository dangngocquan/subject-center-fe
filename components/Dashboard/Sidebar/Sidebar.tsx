import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Đổi từ SearchIcon

import PlanCard from "./PlanCard";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  plans: { id: string; name: string; createdAt: string }[];
  selectedPlanId: string | null | undefined;
  onSelectPlan: (planId: string | null) => void; // Cập nhật để chấp nhận null
}

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  plans,
  selectedPlanId,
  onSelectPlan,
}) => {
  const handleOverviewClick = () => {
    onSelectPlan(null); // Unselect plan khi nhấn Overview
  };

  return (
    <div className="w-64 bg-gray-900/80 p-4 h-screen shadow-lg shadow-cyan-500/20 z-20 l-0 rounded-2xl">
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          className="bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
          placeholder="Search Plans..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Nút Overview */}
      <button
        aria-label="View overview of all plans"
        className="w-full bg-cyan-500 text-white rounded-lg px-4 py-2 mb-6 text-sm font-medium hover:bg-cyan-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        type="button"
        onClick={handleOverviewClick}
      >
        Overview
      </button>
      <ul className="space-y-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            isSelected={selectedPlanId === plan.id}
            plan={plan}
            onClick={() => onSelectPlan(plan.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
