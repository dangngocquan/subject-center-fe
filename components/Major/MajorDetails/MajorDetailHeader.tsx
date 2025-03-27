"use client";

import GenericButton from "@/components/Common/GenericButton";
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
} from "react-icons/fa";

interface MajorDetailHeaderProps {
  majorName: string;
  totalCredits: number;
  isEditMode: boolean;
  allExpanded: boolean;
  onToggleAllExpand: () => void;
  onToggleMode: () => void;
  onResetSelected: () => void;
  onSelectAllRequired: () => void;
  onOpenPlanModal: () => void;
}

const MajorDetailHeader: React.FC<MajorDetailHeaderProps> = ({
  majorName,
  totalCredits,
  isEditMode,
  allExpanded,
  onToggleAllExpand,
  onToggleMode,
  onResetSelected,
  onSelectAllRequired,
  onOpenPlanModal,
}) => {
  const viewModeTooltip = "Only active in Edit Mode";

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#1A2A44] p-4 rounded-lg shadow-lg mb-4"
      style={{ minHeight: "120px" }}
    >
      <motion.div
        animate={{ y: isEditMode ? 0 : "0%" }}
        className="flex flex-col space-y-2 w-full sm:w-auto"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-[#4A90E2] to-white bg-clip-text text-transparent">
          {majorName || "Major List"}
        </h2>

        <motion.span
          animate={{ opacity: 1 }}
          className="text-base sm:text-lg font-medium text-gray-300"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          Selected Credits:{" "}
          <span className="text-[#4A90E2] font-semibold">{totalCredits}</span>
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-col items-start sm:items-end space-y-2 mt-4 sm:mt-0 w-full sm:w-auto"
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap gap-2 mt-2">
          <GenericButton
            tooltipContent={allExpanded ? "Collapse All" : "Expand All"}
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
              isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"
            }
            tooltipId="mode-tooltip"
            onClick={onToggleMode}
          >
            {isEditMode ? <FaEye size={20} /> : <FaEdit size={20} />}
          </GenericButton>
          <GenericButton
            tooltipContent={isEditMode ? "Reset Selection" : viewModeTooltip}
            tooltipId="reset-tooltip"
            onClick={isEditMode ? onResetSelected : undefined}
            disabled={!isEditMode}
          >
            <FaUndo size={20} />
          </GenericButton>
          <GenericButton
            tooltipContent={
              isEditMode ? "Select All Required" : viewModeTooltip
            }
            tooltipId="select-all-tooltip"
            onClick={isEditMode ? onSelectAllRequired : undefined}
            disabled={!isEditMode}
          >
            <FaCheckSquare size={20} />
          </GenericButton>
          <GenericButton
            tooltipContent={
              isEditMode
                ? totalCredits > 0
                  ? "Create Plan with Selected Subjects"
                  : "Select at least 1 subject to create a plan"
                : viewModeTooltip
            }
            tooltipId="create-plan-tooltip"
            onClick={
              isEditMode && totalCredits > 0 ? onOpenPlanModal : undefined
            }
            disabled={!isEditMode || totalCredits === 0}
          >
            <FaPlus size={20} />
          </GenericButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MajorDetailHeader;
