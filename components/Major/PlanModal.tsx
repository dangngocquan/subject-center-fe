import React, { useState } from "react";

import LoadingModal from "../LoadingModal"; // Import LoadingModal
import GenericModal from "../Common/GenericModal"; // Import GenericModal
import GenericButton from "../Common/GenericButton";

import { MajorItem, MajorItemWithChildren } from "@/types/major";
import { Plan, PlanItem } from "@/types/plan";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  majorItems: MajorItem[];
  tree: MajorItemWithChildren[];
  selected: Set<string>;
  onCreatePlan: (plan: Plan) => Promise<{
    isBadRequest: boolean;
    message: string;
    data: any;
    status: number;
  }>;
  onPlanCreated: (result: {
    planName: string; // Thêm planName vào callback
    result: {
      name: string;
      code: string;
      status: "SUCCEEDED" | "FAILED";
      message: string;
    }[];
  }) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  majorItems,
  tree,
  selected,
  onCreatePlan,
  onPlanCreated,
}) => {
  const [planName, setPlanName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUnmetRequirements = () => {
    const unmetGroups: MajorItemWithChildren[] = [];
    tree.forEach((node) => {
      if (!node.isLeaf) {
        const { totalCredits: selectedCredits, totalCount: selectedCount } =
          calculateTotalCreditsAndCount(node, selected);
        const meetsMinCredits =
          node.minCredits === null || selectedCredits >= (node.minCredits ?? 0);
        const meetsMinChildren =
          node.minChildren === null || selectedCount >= (node.minChildren ?? 0);
        if (!meetsMinCredits || !meetsMinChildren) {
          unmetGroups.push(node);
        }
      }
    });
    return unmetGroups;
  };

  const unmetRequirements = getUnmetRequirements();

  const handleCreate = async () => {
    if (!planName.trim()) {
      alert("Please enter a plan name!");
      return;
    }

    setIsLoading(true);
    const selectedItems = Array.from(selected);
    try {
      const response = await onCreatePlan({
        name: planName,
        items: majorItems.filter((node) =>
          selectedItems.includes(node.genCode)
        ) as PlanItem[],
      });

      // Truyền planName và result qua callback
      const result = response.data.result || response.data.results || [];
      onPlanCreated({ planName: String(response?.data?.plan?.id), result });
      onClose();
    } catch (error) {
      alert("An error occurred while creating the plan!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoading && <LoadingModal isOpen={isLoading} />}
      <GenericModal isOpen={isOpen} onClose={onClose}>
        <h3 className="text-xl font-semibold text-color-15 mb-4">
          Create Study Plan
        </h3>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-color-15 mb-1"
            htmlFor="planName"
          >
            Plan Name
          </label>
          <input
            className="w-full p-2 bg-color-1 text-color-15 border border-color-15 rounded-md focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-200 placeholder-color-15 text-sm"
            id="planName"
            placeholder="e.g., Semester 1 Plan 2025"
            // style={{ background: "rgba(42, 58, 84, 0.8)" }}
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        {unmetRequirements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-[#FF6B6B] mb-2">
              Groups not meeting requirements:
            </p>
            <div
              className="max-h-40 overflow-y-auto bg-color-1 p-3 rounded-md border border-color-15 scrollbar-thin scrollbar-thumb-[#4A90E2] scrollbar-track-[#2A3A54] scrollbar-thumb-rounded"
              // style={{ background: "rgba(42, 58, 84, 0.8)" }}
            >
              <ul className="text-color-15 text-sm space-y-2">
                {unmetRequirements.map((group) => {
                  const { totalCredits, totalCount } =
                    calculateTotalCreditsAndCount(group, selected);
                  return (
                    <li
                      key={group.genCode}
                      className="flex justify-between items-center"
                    >
                      <span className="truncate flex-1">{group.name}</span>
                      <span className="text-color-15 text-xs">
                        {group.minCredits && (
                          <span>
                            {totalCredits}/{group.minCredits} credits
                          </span>
                        )}
                        {group.minChildren && (
                          <span>
                            {group.minCredits && " | "}
                            {totalCount}/{group.minChildren} subjects
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <GenericButton
            className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-5 transition-all duration-200 text-sm font-medium"
            tooltipContent="Continue selecting"
            tooltipId="continue-tooltip"
            onClick={onClose}
          >
            Continue selecting
          </GenericButton>
          <GenericButton
            className="px-4 py-2 bg-color-1 text-color-15 rounded-md hover:bg-color-G7 transition-all duration-200 text-sm font-medium"
            disabled={isLoading}
            tooltipContent="Create Plan"
            tooltipId="create-tooltip"
            onClick={handleCreate}
          >
            Create Plan
          </GenericButton>
        </div>
      </GenericModal>
    </>
  );
};

const calculateTotalCreditsAndCount = (
  node: MajorItemWithChildren,
  selected: Set<string>
): { totalCredits: number; totalCount: number } => {
  let totalCredits = 0;
  let totalCount = 0;

  if (node.isLeaf && selected.has(node.genCode) && node.credit !== null) {
    totalCredits += node.credit ?? 0;
    totalCount += 1;
  }

  node.children.forEach((child: MajorItemWithChildren) => {
    const { totalCredits: childCredits, totalCount: childCount } =
      calculateTotalCreditsAndCount(child, selected);
    totalCredits += childCredits;
    totalCount += childCount;
  });

  return { totalCredits, totalCount };
};

export default PlanModal;
