"use client";

import React from "react";
import MajorDetailRow from "./MajorDetailRow";
import { MajorItemWithChildren } from "@/types/major";

interface MajorDetailTableProps {
  flatData: MajorItemWithChildren[];
  isEditMode: boolean;
  expanded: Set<string>;
  selected: Set<string>;
  onToggleExpand: (genCode: string) => void;
  onHandleSelection: (item: MajorItemWithChildren, isChecked: boolean) => void;
}

const MajorDetailTable: React.FC<MajorDetailTableProps> = ({
  flatData,
  isEditMode,
  expanded,
  selected,
  onToggleExpand,
  onHandleSelection,
}) => {
  return (
    <div className="rounded-lg shadow-lg overflow-x-auto bg-[#1A2A44]">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#2A3A54]">
          <tr>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[60px]">
              Select
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[80px]">
              No.
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[200px]">
              Subject Name
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[120px]">
              Subject Code
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[100px]">
              Credits
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[150px]">
              Prerequisites
            </th>
            <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[200px]">
              Requirements
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {flatData.map((node) => (
            <MajorDetailRow
              key={node.genCode}
              node={node}
              isSelected={selected.has(node.genCode)}
              isEditMode={isEditMode}
              expanded={expanded}
              selected={selected}
              onToggleExpand={onToggleExpand}
              onHandleSelection={onHandleSelection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MajorDetailTable;
