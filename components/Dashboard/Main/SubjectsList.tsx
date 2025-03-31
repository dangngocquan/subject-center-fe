import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import ImportJsonModal from "./modals/ImportJsonModal";
import ImportResultModal from "./modals/ImportResultModal";
import CreateNewPlanItemModal from "./modals/CreateNewPlanItemModal";
import EditSubjectModal from "./modals/EditSubjectModal";

import LoadingModal from "@/components/LoadingModal";
import ResultModal from "@/components/Dashboard/Main/ResultModal";
import { PlanItem } from "@/types/plan";
import {
  deletePlanItem,
  updateGradePlanItemByJson,
  updatePlanItem,
} from "@/service/plan.api";

interface SubjectsListProps {
  items: PlanItem[];
  planId: string | null;
  onDataChange?: () => void;
}

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

const SubjectsList: React.FC<SubjectsListProps> = ({
  items,
  planId,
  onDataChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal
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

  useEffect(() => {
    setSubjects(items || []);
  }, [items]);

  const filteredAndSortedSubjects = useMemo(() => {
    let result = subjects.filter((subject) =>
      String(subject.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
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
      const response = await updateGradePlanItemByJson(Number(planId), file);
      if (!response.isBadRequest) {
        const data: ResponseImportUpdateGradePlan = response.data;
        if (data.items && data.items.length > 0) {
          setSubjects((prevSubjects) => {
            const updatedSubjects = [...prevSubjects];
            (data.items ?? []).forEach((newItem) => {
              const index = updatedSubjects.findIndex(
                (subject) => subject.id === newItem.id,
              );
              if (index !== -1) {
                updatedSubjects[index] = {
                  ...updatedSubjects[index],
                  ...newItem,
                };
              } else {
                updatedSubjects.push(newItem);
              }
            });
            return updatedSubjects;
          });
        }
        setImportResult({
          isOpen: true,
          result: data.result ?? [],
        });
        onDataChange?.();
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
          (subject) => subject.id !== subjectToDelete.id,
        );
        setSubjects(updatedSubjects);
        setResultModal({
          isOpen: true,
          message: "Subject deleted successfully!",
          isError: false,
        });
        onDataChange?.();
      } else {
        setResultModal({
          isOpen: true,
          message: `Failed to delete subject: ${response.message}`,
          isError: true,
        });
      }
    } catch (error) {
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
            : subject,
        );
        setSubjects(updatedSubjects);
        setResultModal({
          isOpen: true,
          message: "Subject updated successfully!",
          isError: false,
        });
        onDataChange?.();
      } else {
        setResultModal({
          isOpen: true,
          message: `Failed to update subject: ${result.message}`,
          isError: true,
        });
      }
    } catch (error) {
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

  const handleCreateSubmit = async (newSubject: PlanItem) => {
    setIsLoading(true);
    try {
      const result = await updatePlanItem(Number(planId), {
        name: newSubject.name ?? "",
        code: newSubject.code ?? "",
        credit: newSubject.credit ?? 0,
        prerequisites: newSubject.prerequisites ?? [],
        gradeLatin: newSubject.gradeLatin ?? null,
      });
      if (!result.isBadRequest) {
        setSubjects([...subjects, newSubject]);
        setResultModal({
          isOpen: true,
          message: "Subject created successfully!",
          isError: false,
        });
        onDataChange?.();
      } else {
        setResultModal({
          isOpen: true,
          message: `Failed to update subject: ${result.message}`,
          isError: true,
        });
      }
    } catch (error) {
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
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg shadow-cyan-500/20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-cyan-400 text-xl sm:text-2xl font-semibold">
          Subjects
        </h3>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
              placeholder="Search by subject name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              className="p-2 bg-[#4A90E2] text-white rounded-full hover:bg-[#357ABD] transition-all duration-300"
              data-tooltip-content="Sort Options"
              data-tooltip-id="sort-tooltip"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <ArrowsUpDownIcon className="w-5 h-5" />
            </motion.button>
            {isSortDropdownOpen && (
              <div className="absolute mt-12 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("name")}
                >
                  Sort by Name
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ))}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("code")}
                >
                  Sort by Code
                  {sortConfig.key === "code" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ))}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("credit")}
                >
                  Sort by Credit
                  {sortConfig.key === "credit" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ))}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center"
                  onClick={() => handleSort("grade4")}
                >
                  Sort by Grade
                  {sortConfig.key === "grade4" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 ml-1" />
                    ))}
                </button>
              </div>
            )}
            <motion.button
              className="p-2 bg-[#4A90E2] text-white rounded-full hover:bg-[#357ABD] transition-all duration-300"
              data-tooltip-content="Export to JSON"
              data-tooltip-id="export-tooltip"
              onClick={handleExportJSON}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 bg-[#4A90E2] text-white rounded-full hover:bg-[#357ABD] transition-all duration-300"
              data-tooltip-content="Import JSON to Update Grades"
              data-tooltip-id="import-tooltip"
              onClick={() => setIsImportModalOpen(true)}
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 bg-[#4A90E2] text-white rounded-full hover:bg-[#357ABD] transition-all duration-300"
              data-tooltip-content="Add New Subject"
              data-tooltip-id="add-tooltip"
              onClick={() => setIsCreateModalOpen(true)} // Updated to open create modal
            >
              <PlusIcon className="w-5 h-5" />
            </motion.button>
            <Tooltip id="sort-tooltip" place="top" />
            <Tooltip id="export-tooltip" place="top" />
            <Tooltip id="import-tooltip" place="top" />
            <Tooltip id="add-tooltip" place="top" />
          </div>
        </div>
      </div>

      {filteredAndSortedSubjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="py-2 px-4">Subject Name</th>
                <th className="py-2 px-4">Code</th>
                <th className="py-2 px-4">Credits</th>
                <th className="py-2 px-4">Prerequisites</th>
                <th className="py-2 px-4">Grade (4.0)</th>
                <th className="py-2 px-4">Letter Grade</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSubjects.map((subject, index) => (
                <tr
                  key={subject.id ?? index}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-all duration-200"
                >
                  <td className="py-3 px-4 text-white">
                    {subject.name ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {subject.code ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {subject.credit ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {subject.prerequisites &&
                    subject.prerequisites.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {subject.prerequisites.map((prereq, idx) => (
                          <span key={idx}>{prereq}</span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    className={`py-3 px-4 ${subject.grade4 != null && subject.grade4 < 2.0 ? "text-red-400" : "text-gray-300"}`}
                  >
                    {subject.grade4 ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {subject.gradeLatin ?? "-"}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
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
        </div>
      ) : (
        <p className="text-gray-400">No subjects available.</p>
      )}

      {isModalOpen && selectedSubject && (
        <EditSubjectModal
          initialData={selectedSubject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      {isCreateModalOpen && (
        <CreateNewPlanItemModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
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
