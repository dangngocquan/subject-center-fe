import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

import { siteConfig } from "@/config/site";

interface PlanHeaderProps {
  selectedPlanName: string | null | undefined;
  onToggleSidebar: () => void;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  selectedPlanName,

  onToggleSidebar,
}) => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-2 sm:p-3 md:p-4 flex justify-between items-center shadow-lg shadow-cyan-500/20 w-full flex-wrap gap-2">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0">
        {/* Nút toggle sidebar chỉ hiển thị trên màn hình nhỏ */}
        {selectedPlanName && (
          <button
            aria-label="Toggle sidebar"
            className="md:hidden text-white p-1 sm:p-2"
            onClick={onToggleSidebar}
          >
            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        {!selectedPlanName && (
          <div
            aria-label="Toggle sidebar"
            className="md:hidden text-white p-1 sm:p-2"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
        {/* Tên plan với giới hạn chiều rộng và truncate */}
        <div className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent font-bold text-sm sm:text-base md:text-lg lg:text-xl truncate flex-1 min-w-0">
          {selectedPlanName ? `Plan: ${selectedPlanName}` : "Plans Dashboard"}
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Nút Overview với kích thước và padding responsive */}
        <Link
          aria-label="View overview of all plans"
          className="bg-cyan-500 text-white rounded-full px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 text-xs sm:text-sm hover:bg-cyan-600 transition-all duration-300 whitespace-nowrap"
          href={siteConfig.routers.plans}
        >
          Overview
        </Link>
      </div>
    </nav>
  );
};

export default PlanHeader;
