import React from "react";
import Link from "next/link"; // Import Link component

import { Plan } from "@/types/plan";
import { siteConfig } from "@/config/site";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của Space
    }
  };

  return (
    <Link
      aria-current={isSelected ? "true" : undefined} // Chỉ định trạng thái hiện tại
      aria-label={`Select plan ${plan.name}`} // Cải thiện a11y
      className={`w-full text-left text-color-15 hover:text-color-15 cursor-pointer transition-all duration-300 text-lg flex items-center gap-3 hover:scale-105 rounded-lg px-3 py-2 ${
        isSelected
          ? "bg-color-3 text-color-15 hover:bg-color-6"
          : "bg-color-1 hover:bg-color-6"
      } focus:outline-none focus:ring-1 focus:ring-color-15`}
      href={siteConfig.routers.planDetails(String(plan.id))} // Use dynamic href
      onKeyDown={handleKeyDown} // Thêm listener bàn phím
    >
      {plan.name}
    </Link>
  );
};

export default PlanCard;
