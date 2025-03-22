import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

import LoadingModal from "../LoadingModal"; // Import LoadingModal

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
      alert("Vui lòng nhập tên plan!");
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
      onPlanCreated({ planName, result });
      onClose();
    } catch (error) {
      alert("Đã xảy ra lỗi khi tạo plan!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <>
      {isLoading && <LoadingModal isOpen={isLoading} />}
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <motion.div
          animate="visible"
          className="bg-[#1A2A44] p-6 rounded-lg shadow-xl w-full max-w-md relative border border-[#2A3A54] backdrop-blur-sm"
          exit="exit"
          initial="hidden"
          style={{ background: "rgba(26, 42, 68, 0.95)" }}
          variants={modalVariants}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
            onClick={onClose}
          >
            <FaTimes size={16} />
          </button>

          <h3 className="text-xl font-semibold text-white mb-4">
            Tạo Plan Học Tập
          </h3>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="planName"
            >
              Tên Plan
            </label>
            <input
              className="w-full p-2 bg-[#2A3A54] text-white border border-[#3A4A64] rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A90E2] transition-all duration-200 placeholder-gray-500 text-sm"
              id="planName"
              placeholder="VD: Kế hoạch HK1 2025"
              style={{ background: "rgba(42, 58, 84, 0.8)" }}
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          {unmetRequirements.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-[#FF6B6B] mb-2">
                Các nhóm chưa đáp ứng yêu cầu:
              </p>
              <div
                className="max-h-40 overflow-y-auto bg-[#2A3A54] p-3 rounded-md border border-[#3A4A64] scrollbar-thin scrollbar-thumb-[#4A90E2] scrollbar-track-[#2A3A54] scrollbar-thumb-rounded"
                style={{ background: "rgba(42, 58, 84, 0.8)" }}
              >
                <ul className="text-gray-300 text-sm space-y-2">
                  {unmetRequirements.map((group) => {
                    const { totalCredits, totalCount } =
                      calculateTotalCreditsAndCount(group, selected);
                    return (
                      <li
                        key={group.genCode}
                        className="flex justify-between items-center"
                      >
                        <span className="truncate flex-1">{group.name}</span>
                        <span className="text-gray-400 text-xs">
                          {group.minCredits && (
                            <span>
                              {totalCredits}/{group.minCredits} tín chỉ
                            </span>
                          )}
                          {group.minChildren && (
                            <span>
                              {group.minCredits && " | "}
                              {totalCount}/{group.minChildren} môn
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
            <motion.button
              className="px-4 py-2 bg-[#3A4A64] text-gray-200 rounded-md hover:bg-[#4A5A74] transition-all duration-200 text-sm font-medium"
              style={{ background: "rgba(58, 74, 100, 0.8)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              Tiếp tục chọn thêm
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
            >
              Tạo Plan
            </motion.button>
          </div>
        </motion.div>
      </div>
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
