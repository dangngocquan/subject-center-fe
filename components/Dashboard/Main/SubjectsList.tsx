import {
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaTimes } from "react-icons/fa";

import EditSubjectModal from "./EditSubjectModal";

import GenericModal from "@/components/Common/GenericModal";
import ResultModal from "@/components/Dashboard/Main/ResultModal";
import LoadingModal from "@/components/LoadingModal";
import {
  updateGradePlanItemByJson,
  updatePlanItem,
  deletePlanItem,
} from "@/service/plan.api";
import { PlanItem } from "@/types/plan";

interface SubjectsListProps {
  items: PlanItem[];
  planId: string | null;
  onDataChange?: () => void;
}

// Định nghĩa kiểu cho response của API
interface ResponseImportUpdateGradePlan {
  id?: number;
  name?: string;
  items?: PlanItem[];
  accountId?: number;
  createdAt?: string;
  updatedAt?: string;
  result: {
    name?: string;
    code?: string;
    gradeLatin?: string;
    status?: "UPDATED" | "FAILED" | "NEW";
    message?: string;
  }[];
}

// Modal xác nhận xóa, extend từ GenericModal
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subjectName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  subjectName,
}) => {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Xác nhận xóa môn học
        </h3>
        <p className="text-gray-300 mb-6">
          Bạn có chắc chắn muốn xóa môn học{" "}
          <span className="font-semibold text-cyan-400">{subjectName}</span>{" "}
          không?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-600 text-white rounded-full px-4 py-2 hover:bg-gray-500 transition-all duration-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600 transition-all duration-300"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

// Modal để import file JSON, extend từ GenericModal
interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Vui lòng chọn một file JSON hợp lệ.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    } else {
      alert("Vui lòng chọn một file JSON trước khi gửi.");
    }
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Import JSON để cập nhật điểm
        </h3>
        <p className="text-gray-300 mb-4">
          File JSON cần có định dạng như sau:
        </p>
        <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap">
          {`{
  "subjects": [
    {
      "name": "Toán cao cấp",
      "code": "MATH101",
      "credit": 3,
      "gradeLatin": "A"
    },
    {
      "name": "Vật lý đại cương",
      "code": "PHYS102",
      "credit": 4,
      "gradeLatin": "B+"
    }
  ]
}`}
        </pre>
        <div className="mb-6">
          <label className="inline-block bg-gray-700 text-gray-300 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-600 transition-all duration-300 border border-gray-500">
            Import File from Device
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <p className="text-gray-400 mt-2">Đã chọn: {selectedFile.name}</p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-600 text-white rounded-full px-4 py-2 hover:bg-gray-700 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700 transition-all duration-300"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

// Modal để hiển thị kết quả import, extend từ GenericModal
interface ImportResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ResponseImportUpdateGradePlan["result"];
}

const ImportResultModal: React.FC<ImportResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  // Tính toán số lượng các trạng thái
  const updatedCount =
    result?.filter((item) => item.status === "UPDATED").length ?? 0;
  const newCount = result?.filter((item) => item.status === "NEW").length ?? 0;
  const failedCount =
    result?.filter((item) => item.status === "FAILED").length ?? 0;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        onClick={onClose}
      >
        <FaTimes size={16} />
      </button>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">Kết quả import</h3>

      {/* Summary */}
      <div className="text-sm text-gray-300 mb-4">
        Số môn cập nhật: <span className="text-green-400">{updatedCount}</span>{" "}
        | Số môn mới: <span className="text-yellow-400">{newCount}</span> | Số
        môn thất bại: <span className="text-red-400">{failedCount}</span>
      </div>

      {/* Content */}
      {result && result.length > 0 ? (
        <div className="text-sm max-h-60 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-[#4A90E2] scrollbar-track-[#2A3A54] scrollbar-thumb-rounded">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Table header */}
            <thead style={{ backgroundColor: "#2A3A54" }}>
              <tr>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "40%" }}
                >
                  Tên
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "20%" }}
                >
                  Mã
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "20%" }}
                >
                  Điểm chữ
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: "20%" }}
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="divide-y divide-gray-700">
              {result.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    item.status === "UPDATED"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "NEW"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : item.status === "FAILED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-700/20 text-gray-400"
                  } hover:bg-[#2A3A54]`}
                >
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.name || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.code || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.gradeLatin || "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-normal text-white">
                    {item.status || "-"}
                    {item.message && (
                      <span className="text-gray-500"> ({item.message})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-300 text-sm">Không có kết quả để hiển thị.</p>
      )}

      {/* Close button */}
      <div className="flex justify-end mt-4">
        <motion.button
          className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Đóng
        </motion.button>
      </div>
    </GenericModal>
  );
};

const SubjectsList: React.FC<SubjectsListProps> = ({
  items,
  planId,
  onDataChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    message: string;
    isError: boolean;
  }>({ isOpen: false, message: "", isError: false });
  const [selectedSubject, setSelectedSubject] = useState<PlanItem | null>(null);
  const [subjects, setSubjects] = useState<PlanItem[]>(items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PlanItem | "grade4";
    direction: "asc" | "desc" | null;
  }>({ key: "name", direction: null });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{
    id: number | null | undefined;
    name: string;
  } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    isOpen: boolean;
    result: ResponseImportUpdateGradePlan["result"];
  }>({ isOpen: false, result: [] });

  // Update subjects when items prop changes
  useEffect(() => {
    setSubjects(items || []);
  }, [items]);

  // Handle search and sort with useMemo for optimization
  const filteredAndSortedSubjects = useMemo(() => {
    let result = subjects.filter((subject) =>
      String(subject.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (sortConfig.direction) {
      result = [...result].sort((a, b) => {
        const key = sortConfig.key;
        const direction = sortConfig.direction === "asc" ? 1 : -1;

        if (key === "grade4") {
          const gradeA = a.grade4 ?? 0;
          const gradeB = b.grade4 ?? 0;
          return (gradeA - gradeB) * direction;
        }

        const valueA = a[key] ?? "";
        const valueB = b[key] ?? "";
        return valueA > valueB ? direction : -direction;
      });
    }

    return result;
  }, [subjects, searchTerm, sortConfig]);

  const handleSort = (key: keyof PlanItem | "grade4") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setIsSortDropdownOpen(false);
  };

  // Handle export to JSON
  const handleExportJSON = () => {
    const jsonData = JSON.stringify(subjects, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "subjects.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle import JSON
  const handleImportJSON = async (file: File) => {
    if (!planId) {
      setResultModal({
        isOpen: true,
        message: "Plan ID is missing. Cannot import JSON.",
        isError: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      // Gọi API PATCH /plans/{planId}/item/json
      const response = await updateGradePlanItemByJson(Number(planId), file);

      if (!response.isBadRequest) {
        const data: ResponseImportUpdateGradePlan = response.data;

        // Merge dữ liệu từ response.items vào subjects hiện tại
        if (data.items && data.items.length > 0) {
          setSubjects((prevSubjects) => {
            const updatedSubjects = [...prevSubjects];
            (data.items ?? []).forEach((newItem) => {
              const index = updatedSubjects.findIndex(
                (subject) => subject.id === newItem.id
              );
              if (index !== -1) {
                // Cập nhật môn học nếu đã tồn tại
                updatedSubjects[index] = {
                  ...updatedSubjects[index],
                  ...newItem,
                };
              } else {
                // Thêm môn học mới nếu không tồn tại
                updatedSubjects.push(newItem);
              }
            });
            return updatedSubjects;
          });
        }

        // Hiển thị kết quả từ response.result
        setImportResult({
          isOpen: true,
          result: data.result ?? [],
        });

        onDataChange?.(); // Ensure parent component is notified
      } else {
        setImportResult({
          isOpen: true,
          result: [
            {
              name: "",
              code: "",
              gradeLatin: "",
              status: "FAILED",
              message: response.message || "Failed to import JSON.",
            },
          ],
        });
      }
    } catch (error: any) {
      console.error("Error importing JSON:", error.message || error);
      setImportResult({
        isOpen: true,
        result: [
          {
            name: "",
            code: "",
            gradeLatin: "",
            status: "FAILED",
            message:
              error.message || "An error occurred while importing the file.",
          },
        ],
      });
    } finally {
      setIsLoading(false);
      setIsImportModalOpen(false);
    }
  };

  // Handle delete subject
  const handleDeleteClick = (subject: PlanItem) => {
    setSubjectToDelete({
      id: Number(subject.id),
      name: subject.name ?? "Unknown",
    });
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete || subjectToDelete.id == null || !planId) {
      setResultModal({
        isOpen: true,
        message:
          "Cannot delete subject: Invalid subject ID or missing Plan ID.",
        isError: true,
      });
      setIsConfirmDeleteOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePlanItem(Number(planId), subjectToDelete.id);
      if (!response.isBadRequest) {
        const updatedSubjects = subjects.filter(
          (subject) => subject.id !== subjectToDelete.id
        );
        setSubjects(updatedSubjects);
        onDataChange?.(); // Notify parent to reload data
        setResultModal({
          isOpen: true,
          message: "Subject deleted successfully!",
          isError: false,
        });
        onDataChange?.(); // Ensure parent component is notified
      } else {
        setResultModal({
          isOpen: true,
          message: `Failed to delete subject: ${response.message}`,
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      setResultModal({
        isOpen: true,
        message: "An error occurred while deleting the subject.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDeleteOpen(false);
      setSubjectToDelete(null);
    }
  };

  const handleEditClick = (subject: PlanItem) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (updatedSubject: PlanItem) => {
    if (
      !selectedSubject ||
      selectedSubject.planId == null ||
      updatedSubject.id == null
    ) {
      setResultModal({
        isOpen: true,
        message: "Cannot update subject: Missing required fields.",
        isError: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePlanItem(Number(selectedSubject.planId), {
        id: updatedSubject.id,
        name: updatedSubject.name ?? "",
        code: updatedSubject.code ?? "",
        credit: updatedSubject.credit ?? 0,
        prerequisites: updatedSubject.prerequisites ?? [],
        gradeLatin: updatedSubject.gradeLatin ?? null,
      });
      if (!result.isBadRequest) {
        const updatedSubjects = subjects.map((subject) =>
          subject.id === updatedSubject.id
            ? { ...subject, ...result.data }
            : subject
        );
        setSubjects(updatedSubjects);
        onDataChange?.(); // Notify parent to reload data
        setResultModal({
          isOpen: true,
          message: "Subject updated successfully!",
          isError: false,
        });

        onDataChange?.(); // Ensure parent component is notified
      } else {
        if (result.status === 401) {
          setResultModal({
            isOpen: true,
            message: "Unauthorized. Please log in again.",
            isError: true,
          });
        } else {
          setResultModal({
            isOpen: true,
            message: `Failed to update subject: ${result.message}`,
            isError: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      setResultModal({
        isOpen: true,
        message: "An error occurred while updating the subject.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
      {/* Header with all features */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-cyan-400 text-2xl font-semibold">Subjects</h3>
        <div className="flex space-x-4 items-center">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              placeholder="Search by subject name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <motion.button
              animate={{ opacity: 1 }}
              className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
              data-tooltip-content="Sort Options"
              data-tooltip-id="sort-tooltip"
              initial={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <div className="flex items-center">
                <ArrowsUpDownIcon className="w-5 h-5" />
              </div>
            </motion.button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("name")}
                >
                  Sort by Name
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : sortConfig.direction === "desc" ? (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ) : null)}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("code")}
                >
                  Sort by Code
                  {sortConfig.key === "code" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : sortConfig.direction === "desc" ? (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ) : null)}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("credit")}
                >
                  Sort by Credit
                  {sortConfig.key === "credit" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : sortConfig.direction === "desc" ? (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ) : null)}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("grade4")}
                >
                  Sort by Grade
                  {sortConfig.key === "grade4" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : sortConfig.direction === "desc" ? (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ) : null)}
                </button>
              </div>
            )}
          </div>
          {/* Export JSON */}
          <motion.button
            animate={{ opacity: 1 }}
            className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
            data-tooltip-content="Export to JSON"
            data-tooltip-id="export-tooltip"
            initial={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleExportJSON}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </motion.button>
          {/* Import JSON */}
          <motion.button
            animate={{ opacity: 1 }}
            className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
            data-tooltip-content="Import JSON to Update Grades"
            data-tooltip-id="import-tooltip"
            initial={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsImportModalOpen(true)}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
          </motion.button>
          {/* Add Subject */}
          <motion.button
            animate={{ opacity: 1 }}
            className="p-2 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white rounded-full shadow-md hover:from-[#357ABD] hover:to-[#2A5F9A] transition-all duration-300 transform hover:scale-105 border border-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.5)]"
            data-tooltip-content="Add New Subject"
            data-tooltip-id="add-tooltip"
            initial={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => {}}
          >
            <PlusIcon className="w-5 h-5" />
          </motion.button>
          <Tooltip id="sort-tooltip" place="top" />
          <Tooltip id="export-tooltip" place="top" />
          <Tooltip id="import-tooltip" place="top" />
          <Tooltip id="add-tooltip" place="top" />
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedSubjects.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="py-2">Tên học phần</th>
              <th className="py-2">Mã</th>
              <th className="py-2">Tín chỉ</th>
              <th className="py-2">Điểm (4.0)</th>
              <th className="py-2">Điểm chữ</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSubjects.map((subject, index) => (
              <tr
                key={subject.id ?? index}
                className="border-b border-gray-800 hover:bg-gray-800 transition-all duration-200"
              >
                <td className="py-3 text-white">{subject.name ?? "-"}</td>
                <td className="py-3 text-gray-300">{subject.code ?? "-"}</td>
                <td className="py-3 text-gray-300">{subject.credit ?? "-"}</td>
                <td
                  className={`py-3 ${
                    subject.grade4 != null && subject.grade4 < 2.0
                      ? "text-red-400"
                      : "text-gray-300"
                  }`}
                >
                  {subject.grade4 ?? "-"}
                </td>
                <td className="py-3 text-gray-300">
                  {subject.gradeLatin ?? "-"}
                </td>
                <td className="py-3 flex space-x-2">
                  <button
                    className="text-cyan-400 hover:text-cyan-300 transition-all duration-300"
                    data-tooltip-content="Edit Subject"
                    data-tooltip-id={`edit-tooltip-${index}`}
                    onClick={() => handleEditClick(subject)}
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 transition-all duration-300"
                    data-tooltip-content="Delete Subject"
                    data-tooltip-id={`delete-tooltip-${index}`}
                    onClick={() => handleDeleteClick(subject)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <Tooltip id={`edit-tooltip-${index}`} place="top" />
                  <Tooltip id={`delete-tooltip-${index}`} place="top" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No subjects available.</p>
      )}

      {/* Modals */}
      {isModalOpen && selectedSubject && (
        <EditSubjectModal
          initialData={selectedSubject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      <LoadingModal isOpen={isLoading} />
      <ResultModal
        isError={resultModal.isError}
        isOpen={resultModal.isOpen}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, isOpen: false })}
      />
      {isConfirmDeleteOpen && subjectToDelete && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteOpen}
          subjectName={subjectToDelete.name}
          onClose={() => {
            setIsConfirmDeleteOpen(false);
            setSubjectToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
      {isImportModalOpen && (
        <ImportJsonModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSubmit={handleImportJSON}
        />
      )}
      {importResult.isOpen && (
        <ImportResultModal
          isOpen={importResult.isOpen}
          result={importResult.result}
          onClose={() => setImportResult({ ...importResult, isOpen: false })}
        />
      )}
    </div>
  );
};

export default SubjectsList;
