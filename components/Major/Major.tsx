"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useMajors } from "@/hooks/useMajors";

interface MajorItemWithChildren extends MajorItem {
  children: MajorItemWithChildren[];
}

const buildTree = (items: MajorItem[]): MajorItemWithChildren[] => {
  const itemMap = new Map<string, MajorItemWithChildren>();
  const roots: MajorItemWithChildren[] = [];

  items.forEach((item) => {
    itemMap.set(item.genCode, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = itemMap.get(item.genCode)!;
    if (item.parentGenCode === null) {
      roots.push(node);
    } else {
      const parent = itemMap.get(item.parentGenCode ?? "~");
      if (parent) {
        parent.children.push(node);
      }
    }
  });

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
      result.push({ ...node, level: node.level }); // Giữ level từ node gốc
      if (expanded.has(node.genCode) && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, expanded, seen));
      }
    }
  });
  return result;
};

// Hàm đệ quy tính tổng tín chỉ và số môn được chọn
const calculateTotalCreditsAndCount = (
  node: MajorItemWithChildren,
  selected: Set<string>
): { totalCredits: number; totalCount: number } => {
  let totalCredits = 0;
  let totalCount = 0;

  // Nếu node là lá và được chọn, cộng tín chỉ
  if (node.isLeaf && selected.has(node.genCode) && node.credits !== null) {
    totalCredits += node.credits;
    totalCount += 1;
  }

  // Đệ quy qua tất cả các node con
  node.children.forEach((child) => {
    const { totalCredits: childCredits, totalCount: childCount } =
      calculateTotalCreditsAndCount(child, selected);
    totalCredits += childCredits;
    totalCount += childCount;
  });

  return { totalCredits, totalCount };
};

const Major: React.FC = () => {
  const { majors, loading, error } = useMajors(""); // Sử dụng hook useMajors
  const [data, setData] = useState<MajorItem[]>([]);
  const [tree, setTree] = useState<MajorItemWithChildren[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  console.log({ majors });

  useEffect(() => {
    if (majors.length > 0) {
      const items = majors[0].items;
      setData(items);
      setTree(buildTree(items));
      const initialSelected = new Set<string>();
      items.forEach((item) => {
        if (item.selectionRule === "ALL" && item.isLeaf) {
          initialSelected.add(item.genCode);
        }
      });
      setSelected(initialSelected);
    }
  }, [majors]); // Chỉ chạy khi majors thay đổi

  const toggleAll = (expand: boolean) => {
    if (expand) {
      setExpanded(new Set(data.map((item) => item.genCode)));
    } else {
      setExpanded(new Set());
    }
  };

  const toggleExpand = (genCode: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(genCode)) {
      newExpanded.delete(genCode);
    } else {
      newExpanded.add(genCode);
    }
    setExpanded(newExpanded);
  };

  const handleSelection = (item: MajorItemWithChildren, isChecked: boolean) => {
    const newSelected = new Set(selected);
    if (item.selectionRule === "ALL") return;

    if (item.selectionRule === "ONE") {
      const siblings = data.filter(
        (i) => i.parentGenCode === item.parentGenCode
      );
      siblings.forEach((sibling) => newSelected.delete(sibling.genCode));
      if (isChecked) newSelected.add(item.genCode);
    } else if (item.selectionRule === "MULTI" || !item.selectionRule) {
      if (isChecked) {
        newSelected.add(item.genCode);
      } else {
        newSelected.delete(item.genCode);
      }
    }
    setSelected(newSelected);
  };

  const totalCredits = data
    .filter((item) => selected.has(item.genCode) && item.credits)
    .reduce((sum, item) => sum + (item.credits || 0), 0);

  const flatData = flattenTree(tree, expanded);

  if (loading) {
    return <p className="text-gray-500">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="text-red-500">Đã xảy ra lỗi: {error}</p>;
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0A1A2F" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Khung chương trình đào tạo
        </h2>
        <div className="flex space-x-4">
          <span className="text-lg font-medium text-gray-300">
            Tổng tín chỉ: <span className="text-[#4A90E2]">{totalCredits}</span>
          </span>
          <button
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-full shadow-md hover:bg-[#357ABD] transition-all duration-300 transform hover:scale-105"
            onClick={() => toggleAll(true)}
          >
            Mở tất cả
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => toggleAll(false)}
          >
            Đóng tất cả
          </button>
        </div>
      </div>

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
              const isSelected =
                selected.has(node.genCode) ||
                (node.selectionRule === "ALL" && node.isLeaf);
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

              // Xác định màu nền dựa trên trạng thái
              let rowBackground = "";
              if (!node.isLeaf && (node.minCredits || node.minChildren)) {
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
                        className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] bg-gray-700 border-gray-600"
                        disabled={node.selectionRule === "ALL"}
                        name={node.parentGenCode || undefined}
                        type={
                          node.selectionRule === "ONE" ? "radio" : "checkbox"
                        }
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
                      {node.nameVn}
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
                    {node.courseCode || "-"}
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
                    {node.credits || "-"}
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
                    {node.prerequisiteCodes || "-"}
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
                            Tối thiểu: {node.minCredits} tín chỉ (Đã chọn:{" "}
                            {selectedCredits})
                          </span>
                        )}
                        {node.minChildren && (
                          <span>
                            {node.minCredits ? " / " : ""}Tối thiểu:{" "}
                            {node.minChildren} môn (Đã chọn:{" "}
                            {selectedChildrenCount})
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

export default Major;
