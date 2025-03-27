import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";

import AddPlanMethodModal from "../Sidebar/AddPlanMethodModal";
import CustomPlanModal from "../Sidebar/CustomPlanModal";
import ImportPlanByJsonModal from "../Sidebar/ImportJsonModal";
import ImportPlanResultByJsonModal from "../Sidebar/ImportResultModal";
import SelectSubjectsGuideModal from "../Sidebar/SelectSubjectsGuideModal";
import EditPlanModal from "../Sidebar/SidebarEditPlanModal";

import GenericInputSearch from "@/components/Common/GenericInputSearch";
import GenericPagination from "@/components/Common/GenericPagination";
import { createPlanByImportJSON } from "@/service/plan.api";
import { Credits, Plan } from "@/types/plan";

interface PlansOverviewProps {
  plans: Plan[];
  onSelectPlan: (planId: string | null) => void;
  onUpdatePlanName: (planId: string, newName: string) => void;
  onOpenDeleteModal: (planId: string) => void;
  onAddPlan: (plan: Plan) => void;
}

const slideInVariants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -100 : 100,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
  }),
};

const PlansOverview: React.FC<PlansOverviewProps> = ({
  plans,
  onSelectPlan,
  onUpdatePlanName,
  onOpenDeleteModal,
  onAddPlan,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<Plan | null>(null);
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = React.useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = React.useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = React.useState(false);
  const [importResult, setImportResult] = React.useState<any>(null);

  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số plan mỗi trang

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmitEdit = (newName: string) => {
    if (editingPlan) {
      onUpdatePlanName(editingPlan.id ?? "", newName);
    }
    handleCloseModal();
  };

  const handleAddPlan = () => {
    setIsAddMethodModalOpen(true);
  };

  const handleMethodSelect = (method: string) => {
    setIsAddMethodModalOpen(false);
    if (method === "custom") {
      setIsCustomModalOpen(true);
    } else if (method === "select-subjects") {
      setIsGuideModalOpen(true);
    } else if (method === "import-json") {
      setIsImportModalOpen(true);
    }
  };

  const handleImportJsonSubmit = async (file: File) => {
    try {
      const response = await createPlanByImportJSON(file);
      if (!response.isBadRequest && response.data) {
        const resultData = {
          plan: {
            id: response.data.plan.id?.toString(),
            name: response.data.plan.name,
            items: response.data.plan.items,
          },
          result: response.data.result || [],
        };
        setImportResult(resultData);
        setIsImportModalOpen(false);
        setIsResultModalOpen(true);

        onAddPlan({
          id: response.data.plan.id?.toString(),
          name: response.data.plan.name,
          items: response.data.plan.items,
        });
      } else {
        setImportResult({
          plan: { name: "Unknown" },
          result: [{ status: "FAILED", message: response.message }],
        });
        setIsImportModalOpen(false);
        setIsResultModalOpen(true);
      }
    } catch (error) {
      setImportResult({
        plan: { name: "Unknown" },
        result: [
          { status: "FAILED", message: "An error occurred while importing." },
        ],
      });
      setIsImportModalOpen(false);
      setIsResultModalOpen(true);
    }
  };

  // Giá trị mặc định cho summary nếu không có
  const defaultSummary: Credits = {
    items: [],
    totalCredits: 0,
    totalSubjects: 0,
    totalSubjectsCompleted: 0,
    totalCreditsCompleted: 0,
    totalSubjectsIncomplete: 0,
    totalCreditsIncomplete: 0,
    totalSubjectsCanImprovement: 0,
    totalCreditsCanImprovement: 0,
    currentCPA: 0,
    grades: {},
    totalGradeCompleted: 0,
    totalGradeCanImprovement: 0,
  };

  // Lọc plan theo searchTerm
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [plans, searchTerm]);

  // Tính toán phân trang
  const totalItems = filteredPlans.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      animate="visible"
      className="flex-1 p-4 sm:p-8 w-full"
      custom="left"
      initial="hidden"
      variants={slideInVariants}
    >
      <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg shadow-cyan-500/20 w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-cyan-400 text-xl sm:text-2xl font-semibold">
            Plans Overview
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <GenericInputSearch
              className="w-full sm:w-64"
              placeholder="Search Plans..."
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <button
              aria-label="Add a new plan"
              className="bg-cyan-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-cyan-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="button"
              onClick={handleAddPlan}
            >
              Add Plan
            </button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-gray-400 text-sm">Total Plans</p>
          <p className="text-white text-lg sm:text-2xl font-semibold">
            {filteredPlans.length}
          </p>
        </div>
        <div className="mt-6">
          <h4 className="text-cyan-300 text-lg sm:text-xl font-medium mb-2">
            Plans Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800 text-cyan-400">
                <tr>
                  <th className="p-3 sm:p-4 rounded-tl-lg">Plan Name</th>
                  <th className="p-3 sm:p-4">Subjects</th>
                  <th className="p-3 sm:p-4">Credits</th>
                  <th className="p-3 sm:p-4">GPA</th>
                  <th className="p-3 sm:p-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.length === 0 ? (
                  <tr>
                    <td
                      className="p-3 sm:p-4 text-center text-gray-500"
                      colSpan={5}
                    >
                      {searchTerm
                        ? "No plans match your search."
                        : "No plans available. Click 'Add Plan' to create a new one."}
                    </td>
                  </tr>
                ) : (
                  currentPlans.map((plan, index) => {
                    const summary = plan.summary ?? defaultSummary;
                    const isLastRow = index === currentPlans.length - 1;
                    return (
                      <tr
                        key={plan.id}
                        className="border-b border-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        onClick={() => onSelectPlan(plan.id ?? null)}
                      >
                        <td
                          className={`p-3 sm:p-4 text-white ${
                            isLastRow ? "rounded-bl-lg" : ""
                          }`}
                        >
                          {plan.name}
                        </td>
                        <td className="p-3 sm:p-4">
                          {summary.totalSubjects} subjects
                        </td>
                        <td className="p-3 sm:p-4">
                          {summary.totalCredits} credits
                        </td>
                        <td className="p-3 sm:p-4">
                          <span
                            className={
                              summary.currentCPA >= 8
                                ? "text-cyan-400"
                                : "text-gray-400"
                            }
                          >
                            {summary.currentCPA.toFixed(4)}
                          </span>
                        </td>
                        <td
                          className={`p-3 sm:p-4 flex gap-2 ${
                            isLastRow ? "rounded-br-lg" : ""
                          }`}
                        >
                          <button
                            aria-label="Edit plan name"
                            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(plan);
                            }}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            aria-label="Delete plan"
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDeleteModal(plan.id ?? "");
                            }}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Tích hợp GenericPagination */}
          {filteredPlans.length > itemsPerPage && (
            <div className="mt-6 flex justify-center">
              <GenericPagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                maxVisiblePages={5}
                setCurrentPage={setCurrentPage}
                totalItems={filteredPlans.length}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reusing modals from Sidebar */}
      <EditPlanModal
        initialName={editingPlan?.name ?? ""}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEdit}
      />
      <AddPlanMethodModal
        isOpen={isAddMethodModalOpen}
        onClose={() => setIsAddMethodModalOpen(false)}
        onMethodSelect={handleMethodSelect}
      />
      <CustomPlanModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={onAddPlan}
      />
      <SelectSubjectsGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onNavigate={() => {
          setIsGuideModalOpen(false);
          // Add navigation logic if needed
        }}
      />
      <ImportPlanByJsonModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleImportJsonSubmit}
      />
      <ImportPlanResultByJsonModal
        isOpen={isResultModalOpen}
        result={importResult}
        onClose={() => setIsResultModalOpen(false)}
      />
    </motion.div>
  );
};

export default PlansOverview;
