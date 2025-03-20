"use client";

import { useMajorDetail } from "@/hooks/useMajorDetail";
import { API_ROUTES } from "@/service/api-route.service";
import BaseRequest from "@/service/base-request.service";
import { MajorItem } from "@/types/major";
import { Plan } from "@/types/plan";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowsAltV,
  FaCheckSquare,
  FaCompressArrowsAlt,
  FaEdit,
  FaEye,
  FaPlus,
  FaUndo,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import LoadingModal from "../LoadingModal";
import PlanModal from "./PlanModal";
import { apiUpsertPlan } from "@/service/plan.api";

interface MajorItemWithChildren extends MajorItem {
  children: MajorItemWithChildren[];
}

interface MajorDetailProps {
  id: string;
}

const buildTree = (items: MajorItem[]): MajorItemWithChildren[] => {
  console.log("buildTree input items:", items);
  const itemMap = new Map<string, MajorItemWithChildren>();
  const roots: MajorItemWithChildren[] = [];

  items.forEach((item) => {
    console.log(item.genCode);
    itemMap.set(item.genCode, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = itemMap.get(item.genCode)!;
    if (item.parentGenCode === null) {
      roots.push(node);
    } else {
      const parent = itemMap.get(item.parentGenCode ?? "");
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  console.log("buildTree result:", roots);
  return roots;
};

const flattenTree = (
  nodes: MajorItemWithChildren[],
  expanded: Set<string>,
  seen = new Set<string>()
): MajorItemWithChildren[] => {
  let result: MajorItemWithChildren[] = [];
  nodes.forEach((node) => {
    if (!seen.has(node.genCode)) {
      seen.add(node.genCode);
      result.push({ ...node, level: node.level });
      if (expanded.has(node.genCode) && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, expanded, seen));
      }
    }
  });
  console.log("flattenTree result:", result);
  return result;
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

  node.children.forEach((child) => {
    const { totalCredits: childCredits, totalCount: childCount } =
      calculateTotalCreditsAndCount(child, selected);
    totalCredits += childCredits;
    totalCount += childCount;
  });

  return { totalCredits, totalCount };
};

const findRequiredSubjects = (
  nodes: MajorItemWithChildren[],
  data: MajorItem[]
): Set<string> => {
  const requiredSubjects = new Set<string>();

  nodes.forEach((node) => {
    const children = node.children;
    const directLeaves = children.filter((child) => child.isLeaf);
    const subGroups = children.filter((child) => !child.isLeaf);

    let effectiveMinCredits = node.minCredits ?? null;
    if (effectiveMinCredits === null && node.minChildren !== null) {
      const leafCredits = directLeaves
        .map((leaf) => leaf.credit ?? 0)
        .filter((credits) => credits > 0)
        .sort((a, b) => a - b);
      const minChildCredits = leafCredits
        .slice(0, node.minChildren)
        .reduce((sum, cred) => sum + cred, 0);
      effectiveMinCredits = minChildCredits;
    }

    const totalDirectLeafCredits = directLeaves.reduce(
      (sum, leaf) => sum + (leaf.credit ?? 0),
      0
    );

    if (effectiveMinCredits !== null) {
      if (subGroups.length === 0 && directLeaves.length > 0) {
        if (effectiveMinCredits === totalDirectLeafCredits) {
          directLeaves.forEach((leaf) => requiredSubjects.add(leaf.genCode));
        }
      }

      if (subGroups.length > 0 && directLeaves.length > 0) {
        const sumSubGroupMinCredits = subGroups.reduce(
          (sum, group) => sum + (group.minCredits ?? 0),
          0
        );
        const remainingCredits = effectiveMinCredits - sumSubGroupMinCredits;
        if (remainingCredits === totalDirectLeafCredits) {
          directLeaves.forEach((leaf) => requiredSubjects.add(leaf.genCode));
        }
      }
    }

    if (subGroups.length > 0 && directLeaves.length === 0) {
      const subRequired = findRequiredSubjects(subGroups, data);
      subRequired.forEach((genCode) => requiredSubjects.add(genCode));
    }
  });

  return requiredSubjects;
};

const MajorDetail: React.FC<MajorDetailProps> = ({ id }) => {
  const { major, loading, error } = useMajorDetail(Number(id));
  const [data, setData] = useState<MajorItem[]>([]);
  const [tree, setTree] = useState<MajorItemWithChildren[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (major) {
      const items = major.items;
      setData(items);
      setTree(buildTree(items));
      setSelected(new Set());
    } else {
      const mockData: MajorItem[] = [];
      setData(mockData);
      setTree(buildTree(mockData));
      setSelected(new Set());
    }
  }, [major]);

  const toggleExpand = (genCode: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(genCode)) {
      newExpanded.delete(genCode);
    } else {
      newExpanded.add(genCode);
    }
    setExpanded(newExpanded);
  };

  const toggleAllExpand = () => {
    const expandableNodes = data
      .filter((item) => !item.isLeaf)
      .map((item) => item.genCode);
    const allExpanded = expandableNodes.every((genCode) =>
      expanded.has(genCode)
    );

    if (allExpanded) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(data.map((item) => item.genCode)));
    }
  };

  const handleSelection = (item: MajorItemWithChildren, isChecked: boolean) => {
    if (!isEditMode) return;

    const newSelected = new Set(selected);
    if (isChecked) {
      newSelected.add(item.genCode);
    } else {
      newSelected.delete(item.genCode);
    }
    setSelected(newSelected);
  };

  const toggleMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const resetSelected = () => {
    setSelected(new Set());
  };

  const selectAllRequired = () => {
    console.log(
      "Data for selectAllRequired:",
      data.map((item) => ({
        genCode: item.genCode,
        name: item.name,
        isLeaf: item.isLeaf,
        credits: item.credit,
        minCredits: item.minCredits,
        minChildren: item.minChildren,
      }))
    );
    const requiredSubjects = findRequiredSubjects(tree, data);
    console.log("Required subjects:", Array.from(requiredSubjects));
    setSelected(requiredSubjects);
  };

  const totalCredits = useMemo(() => {
    return data
      .filter((item) => selected.has(item.genCode) && item.credit)
      .reduce((sum, item) => sum + (item.credit || 0), 0);
  }, [data, selected]);

  const flatData = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);

  const expandableNodes = useMemo(
    () => data.filter((item) => !item.isLeaf).map((item) => item.genCode),
    [data]
  );
  const allExpanded = expandableNodes.every((genCode) => expanded.has(genCode));

  const openPlanModal = () => {
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
  };

  if (loading) return <LoadingModal isOpen={loading} />;

  if (error) return <p className="text-red-500">Đã xảy ra lỗi: {error}</p>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0A1A2F" }}>
      <motion.div
        className="flex justify-between items-center bg-[#1A2A44] p-4 rounded-lg shadow-lg my-4"
        style={{ height: "150px" }} // Tăng chiều cao header lên 150px
      >
        {/* Bên trái: Tiêu đề và thông tin tổng tín chỉ */}
        <motion.div
          className="flex flex-col space-y-2"
          animate={{
            y: isEditMode ? 0 : "50%", // Dịch chuyển nội dung xuống giữa khi không ở edit mode
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h2
            className="text-2xl font-bold tracking-wide"
            style={{
              background: "linear-gradient(to right, #4A90E2, #FFFFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {major?.name || "Danh Sách Ngành Học"}
          </h2>
          {isEditMode && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-gray-300"
            >
              Tổng tín chỉ:{" "}
              <span className="text-[#4A90E2] font-semibold">
                {totalCredits}
              </span>
            </motion.span>
          )}
        </motion.div>

        {/* Bên phải: Các nút chức năng */}
        <div className="flex flex-col items-end space-y-2">
          <div className="flex space-x-2">
            {/* Nút mở/đóng tất cả */}
            <motion.button
              animate={{ opacity: 1 }}
              className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
              data-tooltip-content={allExpanded ? "Đóng tất cả" : "Mở tất cả"}
              data-tooltip-id="expand-tooltip"
              initial={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={toggleAllExpand}
            >
              {allExpanded ? (
                <FaCompressArrowsAlt size={20} />
              ) : (
                <FaArrowsAltV size={20} />
              )}
            </motion.button>

            {/* Nút chỉnh sửa/xem */}
            <motion.button
              animate={{ opacity: 1 }}
              className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
              data-tooltip-content={isEditMode ? "Chỉ xem" : "Chỉnh sửa"}
              data-tooltip-id="mode-tooltip"
              initial={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMode}
            >
              {isEditMode ? <FaEye size={20} /> : <FaEdit size={20} />}
            </motion.button>
          </div>

          {/* Hàng nút thứ hai: Đặt lại và Chọn môn bắt buộc */}
          {isEditMode && (
            <div className="flex space-x-2">
              {/* Nút đặt lại */}
              <motion.button
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
                data-tooltip-content="Đặt lại lựa chọn"
                data-tooltip-id="reset-tooltip"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={resetSelected}
              >
                <FaUndo size={20} />
              </motion.button>

              {/* Nút chọn tất cả môn bắt buộc */}
              <motion.button
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
                data-tooltip-content="Chọn tất cả môn bắt buộc"
                data-tooltip-id="select-all-tooltip"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={selectAllRequired}
              >
                <FaCheckSquare size={20} />
              </motion.button>
            </div>
          )}

          {/* Hàng nút thứ ba: Tạo plan sử dụng các môn học đã chọn */}
          {isEditMode && (
            <div className="w-[80px] flex justify-center">
              <motion.button
                animate={{ opacity: 1, scale: 1 }}
                className={`p-2 bg-gradient-to-r ${
                  totalCredits === 0
                    ? "from-gray-500 to-gray-600 cursor-not-allowed"
                    : "from-[#4A90E2] to-[#357ABD] hover:from-[#357ABD] hover:to-[#2A5F9A]"
                } text-white rounded-full shadow-md transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]`}
                data-tooltip-content={
                  totalCredits > 0
                    ? "Tạo plan sử dụng các môn học đã chọn"
                    : "Cần chọn tối thiểu 1 môn để tạo plan"
                }
                data-tooltip-id="create-plan-tooltip"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={totalCredits > 0 ? openPlanModal : undefined}
                disabled={totalCredits === 0}
              >
                <FaPlus size={20} />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <PlanModal
            isOpen={isPlanModalOpen}
            onClose={closePlanModal}
            majorItems={major?.items ?? []}
            tree={tree}
            selected={selected}
            onCreatePlan={(plan) => apiUpsertPlan(plan)}
          />
        )}
      </AnimatePresence>

      {/* Tùy chỉnh style cho Tooltip */}
      <Tooltip
        id="expand-tooltip"
        place="bottom"
        style={{
          backgroundColor: "#2A3A54",
          color: "#FFFFFF",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      />
      <Tooltip
        id="mode-tooltip"
        place="bottom"
        style={{
          backgroundColor: "#2A3A54",
          color: "#FFFFFF",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      />
      <Tooltip
        id="reset-tooltip"
        place="bottom"
        style={{
          backgroundColor: "#2A3A54",
          color: "#FFFFFF",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      />
      <Tooltip
        id="select-all-tooltip"
        place="bottom"
        style={{
          backgroundColor: "#2A3A54",
          color: "#FFFFFF",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      />
      <Tooltip
        id="create-plan-tooltip"
        place="bottom"
        style={{
          backgroundColor: "#2A3A54",
          color: "#FFFFFF",
          padding: "8px 12px",
          borderRadius: "4px",
          zIndex: 1000,
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      />

      <div
        className="rounded-lg shadow-lg overflow-x-auto"
        style={{ backgroundColor: "#1A2A44" }}
      >
        <table
          className="min-w-full divide-y divide-gray-700"
          style={{ tableLayout: "fixed" }}
        >
          <thead style={{ backgroundColor: "#2A3A54" }}>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "60px", maxWidth: "60px" }}
              >
                Chọn
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "80px", maxWidth: "80px" }}
              >
                STT
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "300px", maxWidth: "300px" }}
              >
                Tên học phần
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "120px", maxWidth: "120px" }}
              >
                Mã HP
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "100px", maxWidth: "100px" }}
              >
                Tín chỉ
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "150px", maxWidth: "150px" }}
              >
                Tiên quyết
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                style={{ width: "250px", maxWidth: "250px" }}
              >
                Yêu cầu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {flatData.map((node) => {
              const isSelected = selected.has(node.genCode);
              const hasChildren = node.children.length > 0;
              const {
                totalCredits: selectedCredits,
                totalCount: selectedChildrenCount,
              } = calculateTotalCreditsAndCount(node, selected);
              const meetsMinCredits =
                node.minCredits === null ||
                selectedCredits >= (node.minCredits ?? 0);
              const meetsMinChildren =
                node.minChildren === null ||
                selectedChildrenCount >= (node.minChildren ?? 0);
              const isExpandable = !node.isLeaf && hasChildren;

              let rowBackground = "";
              if (
                isEditMode &&
                !node.isLeaf &&
                (node.minCredits || node.minChildren)
              ) {
                rowBackground =
                  meetsMinCredits && meetsMinChildren
                    ? "bg-green-500/20"
                    : "bg-red-500/20";
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
                      handleSelection(node, !isSelected);
                    } else if (isExpandable) {
                      toggleExpand(node.genCode);
                    }
                  }}
                >
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "60px",
                      maxWidth: "60px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
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
                        onChange={(e) =>
                          handleSelection(node, e.target.checked)
                        }
                      />
                    )}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "80px",
                      maxWidth: "80px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    {node.stt}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "300px",
                      maxWidth: "300px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    <span
                      className={`${
                        node.level > 0 ? `ml-${node.level * 4}` : ""
                      } ${!node.isLeaf ? "font-semibold" : ""}`}
                    >
                      {node.name}
                      {isExpandable && (
                        <span className="ml-2 text-gray-400">
                          {expanded.has(node.genCode) ? "▼" : "▶"}
                        </span>
                      )}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "120px",
                      maxWidth: "120px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    {node.code || "-"}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "100px",
                      maxWidth: "100px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    {node.credit || "-"}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "150px",
                      maxWidth: "150px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    {node.prerequisites?.join(", ") || "-"}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      width: "250px",
                      maxWidth: "250px",
                      whiteSpace: "normal",
                      verticalAlign: "top",
                    }}
                  >
                    {!node.isLeaf && (node.minCredits || node.minChildren) && (
                      <span>
                        {node.minCredits && (
                          <span>
                            Tối thiểu: {node.minCredits} tín chỉ
                            {isEditMode && ` (Đã chọn: ${selectedCredits})`}
                          </span>
                        )}
                        {node.minChildren && (
                          <span>
                            {node.minCredits ? " / " : ""}Tối thiểu:{" "}
                            {node.minChildren} môn
                            {isEditMode &&
                              ` (Đã chọn: ${selectedChildrenCount})`}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MajorDetail;
