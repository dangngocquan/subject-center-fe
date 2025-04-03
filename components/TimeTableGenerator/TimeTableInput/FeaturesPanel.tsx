"use client";

import React from "react";
import { FaPlus, FaPlay, FaCheckSquare, FaUndo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

import { GenericButton } from "@/components/Common/GenericButton";

interface FeaturesPanelProps {
  onAddNewCourses: () => void;
  onGenerate: () => void;
  isCalculating: boolean;
  onToggleSelection: () => void;
  selectedCourses: number;
  allSelected: boolean;
}

const FeaturesPanel: React.FC<FeaturesPanelProps> = ({
  onAddNewCourses,
  onGenerate,
  isCalculating,
  onToggleSelection,
  selectedCourses,
  allSelected,
}) => {
  return (
    <>
      <div className="flex flex-col items-end space-y-4 w-full md:flex-row md:space-y-0 md:space-x-2">
        <div className="flex flex-col space-y-2 w-full md:flex-row md:space-y-0 md:space-x-2">
          <GenericButton
            className="text-sm w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
            tooltipContent="Thêm khóa học mới"
            tooltipId="add-courses-tooltip"
            onClick={onAddNewCourses}
          >
            <FaPlus className="w-4 h-4 md:w-5 md:h-5" />
          </GenericButton>

          <GenericButton
            className="text-sm w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
            tooltipContent={allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            tooltipId="toggle-selection-tooltip"
            onClick={onToggleSelection}
          >
            {allSelected ? (
              <FaUndo className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <FaCheckSquare className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </GenericButton>

          <GenericButton
            className="text-sm w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
            disabled={isCalculating || selectedCourses === 0}
            tooltipContent={
              isCalculating ? "Đang tạo timetable" : "Tạo timetable"
            }
            tooltipId="generate-tooltip"
            onClick={onGenerate}
          >
            {isCalculating ? (
              <span className="text-xs md:text-sm">Đang tính...</span>
            ) : (
              <FaPlay className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </GenericButton>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50 text-xs md:text-sm"
        id="add-courses-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50 text-xs md:text-sm"
        id="toggle-selection-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50 text-xs md:text-sm"
        id="generate-tooltip"
        place="bottom"
      />
    </>
  );
};

export default FeaturesPanel;
