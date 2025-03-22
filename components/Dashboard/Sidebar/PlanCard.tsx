import React from "react";

import { Plan } from "@/types/plan";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onClick: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của Space
      onClick();
    }
  };

  return (
    <button
      aria-current={isSelected ? "true" : undefined} // Chỉ định trạng thái hiện tại
      aria-label={`Select plan ${plan.name}`} // Cải thiện a11y
      className={`w-full text-left text-gray-300 hover:text-cyan-400 cursor-pointer transition-all duration-300 text-lg flex items-center gap-3 hover:bg-gray-800 hover:scale-105 rounded-lg px-3 py-2 ${
        isSelected ? "bg-gray-800 text-cyan-400" : ""
      } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
      type="button" // Xác định rõ đây là button
      onClick={onClick}
      onKeyDown={handleKeyDown} // Thêm listener bàn phím
    >
      {plan.name}
    </button>
  );
};

export default PlanCard;
