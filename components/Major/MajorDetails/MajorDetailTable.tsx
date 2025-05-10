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
    <div className="rounded-lg shadow-lg overflow-x-auto bg-color-1 border border-color-15 text-color-15">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-color-6">
          <tr>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-[60px]">
              Select
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-[80px]">
              No.
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">
              Subject Name
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-[120px]">
              Subject Code
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-[100px]">
              Credits
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-[150px]">
              Prerequisites
            </th>
            <th className="font-semibold px-2 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">
              Requirements
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-color-15">
          {flatData.map((node) => (
            <MajorDetailRow
              key={node.genCode}
              expanded={expanded}
              isEditMode={isEditMode}
              isSelected={selected.has(node.genCode)}
              node={node}
              selected={selected}
              onHandleSelection={onHandleSelection}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MajorDetailTable;
