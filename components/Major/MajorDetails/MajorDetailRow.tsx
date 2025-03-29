"use client";

import { motion } from "framer-motion";
import React from "react";

import { calculateTotalCreditsAndCount } from "./majorUtils";

import { MajorItemWithChildren } from "@/types/major";

interface MajorDetailRowProps {
  node: MajorItemWithChildren;
  isSelected: boolean;
  isEditMode: boolean;
  expanded: Set<string>;
  selected: Set<string>;
  onToggleExpand: (genCode: string) => void;
  onHandleSelection: (item: MajorItemWithChildren, isChecked: boolean) => void;
}

const MajorDetailRow: React.FC<MajorDetailRowProps> = ({
  node,
  isSelected,
  isEditMode,
  expanded,
  selected,
  onToggleExpand,
  onHandleSelection,
}) => {
  const hasChildren = node.children.length > 0;
  const { totalCredits: selectedCredits, totalCount: selectedChildrenCount } =
    calculateTotalCreditsAndCount(node, selected);
  const meetsMinCredits =
    node.minCredits === null || selectedCredits >= (node.minCredits ?? 0);
  const meetsMinChildren =
    node.minChildren === null ||
    selectedChildrenCount >= (node.minChildren ?? 0);
  const isExpandable = !node.isLeaf && hasChildren;

  let rowBackground = "";
  if (isEditMode && !node.isLeaf && (node.minCredits || node.minChildren)) {
    rowBackground =
      meetsMinCredits && meetsMinChildren ? "bg-green-500/20" : "bg-red-500/20";
  }

  return (
    <motion.tr
      key={node.genCode}
      animate={{ opacity: 1 }}
      className={`hover:bg-[#2A3A54] cursor-pointer ${rowBackground}`}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (
          node.isLeaf &&
          node.parentGenCode &&
          (e.target as HTMLElement).tagName !== "INPUT"
        ) {
          onHandleSelection(node, !isSelected);
        } else if (isExpandable) {
          onToggleExpand(node.genCode);
        }
      }}
    >
      <td className="px-2 sm:px-6 py-4 w-[60px] align-top">
        {node.isLeaf && node.parentGenCode && (
          <input
            checked={isSelected}
            className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] bg-gray-700 border-gray-600 transition-opacity duration-300"
            disabled={!isEditMode}
            name={node.parentGenCode || undefined}
            style={{
              opacity: isEditMode ? 1 : 0,
              pointerEvents: isEditMode ? "auto" : "none",
            }}
            type="checkbox"
            onChange={(e) => onHandleSelection(node, e.target.checked)}
          />
        )}
      </td>
      <td className="px-2 sm:px-6 py-4 w-[80px] align-top">{node.stt}</td>
      <td className="px-2 sm:px-6 py-4 min-w-[200px] align-top">
        <span
          className={`${node.level > 0 ? `ml-${node.level * 2} sm:ml-${node.level * 4}` : ""} ${
            !node.isLeaf ? "font-semibold" : ""
          }`}
        >
          {node.name}
          {isExpandable && (
            <span className="ml-2 text-gray-400">
              {expanded.has(node.genCode) ? "▼" : "▶"}
            </span>
          )}
        </span>
      </td>
      <td className="px-2 sm:px-6 py-4 w-[120px] align-top">
        {node.code || "-"}
      </td>
      <td className="px-2 sm:px-6 py-4 w-[100px] align-top">
        {node.credit || "-"}
      </td>
      <td className="px-2 sm:px-6 py-4 w-[150px] align-top truncate">
        {node.prerequisites?.join(", ") || "-"}
      </td>
      <td className="px-2 sm:px-6 py-4 min-w-[200px] align-top">
        {!node.isLeaf && (node.minCredits || node.minChildren) && (
          <span>
            {node.minCredits && (
              <span>
                Minimum: {node.minCredits} credits
                {isEditMode && ` (Selected: ${selectedCredits})`}
              </span>
            )}
            {node.minChildren && (
              <span>
                {node.minCredits ? " / " : ""}Minimum: {node.minChildren}{" "}
                subjects
                {isEditMode && ` (Selected: ${selectedChildrenCount})`}
              </span>
            )}
          </span>
        )}
      </td>
    </motion.tr>
  );
};

export default MajorDetailRow;
