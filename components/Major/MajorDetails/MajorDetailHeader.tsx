"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  FaArrowsAltV,
  FaCheckSquare,
  FaCompressArrowsAlt,
  FaEdit,
  FaEye,
  FaPlus,
  FaUndo,
  FaList,
  FaProjectDiagram,
} from "react-icons/fa";

import GenericButton from "@/components/Common/GenericButton";

interface MajorDetailHeaderProps {
  majorName: string;
  totalCredits: number;
  isEditMode: boolean;
  allExpanded: boolean;
  viewMode: "list" | "graph";
  onToggleAllExpand: () => void;
  onToggleMode: () => void;
  onResetSelected: () => void;
  onSelectAllRequired: () => void;
  onOpenPlanModal: () => void;
  onToggleViewMode: () => void;
}

const MajorDetailHeader: React.FC<MajorDetailHeaderProps> = ({
  majorName,
  totalCredits,
  isEditMode,
  allExpanded,
  viewMode,
  onToggleAllExpand,
  onToggleMode,
  onResetSelected,
  onSelectAllRequired,
  onOpenPlanModal,
  onToggleViewMode,
}) => {
  const viewModeTooltip = "Chỉ hoạt động trong chế độ chỉnh sửa";

  // Determine the toggle action based on totalCredits
  const handleToggleSelection = () => {
    if (totalCredits > 0) {
      onResetSelected();
    } else {
      onSelectAllRequired();
    }
  };

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-color-1 p-4 rounded-lg shadow-lg mb-4 border border-color-15"
      style={{ minHeight: "120px" }}
    >
      <motion.div
        animate={{ y: isEditMode ? 0 : "0%" }}
        className="flex flex-col space-y-2 w-full sm:w-auto"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-color-15 to-color-5 bg-clip-text">
          {majorName || "Danh sách chuyên ngành"}
        </h2>

        <motion.span
          animate={{ opacity: 1 }}
          className="text-base sm:text-lg font-medium text-color-15"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          Tổng tín chỉ đã chọn:{" "}
          <span className="text-color-G8 font-semibold">{totalCredits}</span>
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-col items-start sm:items-end space-y-2 mt-4 sm:mt-0 w-full sm:w-auto"
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          <GenericButton
            tooltipContent={allExpanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
            tooltipId="expand-tooltip"
            onClick={onToggleAllExpand}
          >
            {allExpanded ? (
              <FaCompressArrowsAlt size={20} />
            ) : (
              <FaArrowsAltV size={20} />
            )}
          </GenericButton>
          <GenericButton
            tooltipContent={
              isEditMode
                ? "Chuyển sang chế độ xem"
                : "Chuyển sang chế độ chỉnh sửa"
            }
            tooltipId="mode-tooltip"
            onClick={onToggleMode}
          >
            {isEditMode ? <FaEye size={20} /> : <FaEdit size={20} />}
          </GenericButton>
          {/* Combined Toggle Button */}
          <GenericButton
            disabled={!isEditMode}
            tooltipContent={
              isEditMode
                ? totalCredits > 0
                  ? "Xóa lựa chọn"
                  : "Chọn tất cả bắt buộc"
                : viewModeTooltip
            }
            tooltipId="toggle-selection-tooltip"
            onClick={isEditMode ? handleToggleSelection : undefined}
          >
            {totalCredits > 0 ? (
              <FaUndo size={20} />
            ) : (
              <FaCheckSquare size={20} />
            )}
          </GenericButton>
          <GenericButton
            disabled={!isEditMode || totalCredits === 0}
            tooltipContent={
              isEditMode
                ? totalCredits > 0
                  ? "Tạo kế hoạch với các môn đã chọn"
                  : "Chọn ít nhất 1 môn để tạo kế hoạch"
                : viewModeTooltip
            }
            tooltipId="create-plan-tooltip"
            onClick={
              isEditMode && totalCredits > 0 ? onOpenPlanModal : undefined
            }
          >
            <FaPlus size={20} />
          </GenericButton>
          <GenericButton
            tooltipContent={
              viewMode === "list"
                ? "Chuyển sang xem đồ thị"
                : "Chuyển sang xem danh sách"
            }
            tooltipId="view-mode-tooltip"
            onClick={onToggleViewMode}
          >
            {viewMode === "list" ? (
              <FaProjectDiagram size={20} />
            ) : (
              <FaList size={20} />
            )}
          </GenericButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MajorDetailHeader;
