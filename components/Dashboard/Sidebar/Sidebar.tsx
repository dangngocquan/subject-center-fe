import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PlanCard from "./PlanCard";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  plans: { id: string; name: string; createdAt: string }[];
  selectedPlanId: string | null | undefined;
  onSelectPlan: (planId: string | null) => void;
}

const ShowMoreToggle: React.FC<{ showAll: boolean; onToggle: () => void }> = ({
  showAll,
  onToggle,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden overflow-y-hidden">
      <div
        role="button"
        tabIndex={0}
        className="py-4 text-center cursor-pointer bg-gradient-to-b from-white/10 to-gray-900/80 w-[calc(100%+16px)] h-[60px] -mx-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors duration-300">
          {showAll ? "Show less" : "Show more"}
        </span>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  plans,
  selectedPlanId,
  onSelectPlan,
}) => {
  const [showAll, setShowAll] = useState(false);
  const MAX_INITIAL_PLANS = 10;

  const handleOverviewClick = () => {
    onSelectPlan(null);
  };

  const displayedPlans = showAll ? plans : plans.slice(0, MAX_INITIAL_PLANS);

  return (
    <div className="w-64 bg-gray-900/80 shadow-lg shadow-cyan-500/20 z-20 l-0 rounded-2xl flex flex-col overflow-hidden">
      <div className="p-4">
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
        <button
          aria-label="View overview of all plans"
          className="w-full bg-cyan-500 text-white rounded-lg px-4 py-2 mb-6 text-sm font-medium hover:bg-cyan-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          type="button"
          onClick={handleOverviewClick}
        >
          Overview
        </button>
      </div>
      <div className="flex flex-col">
        <div className={showAll ? "h-auto" : "max-h-[400px] overflow-y-auto"}>
          <ul className="space-y-4 px-4">
            {displayedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                isSelected={selectedPlanId === plan.id}
                plan={plan}
                onClick={() => onSelectPlan(plan.id)}
              />
            ))}
          </ul>
        </div>
        {plans.length > MAX_INITIAL_PLANS && (
          <div className="w-full">
            <ShowMoreToggle
              showAll={showAll}
              onToggle={() => setShowAll(!showAll)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
