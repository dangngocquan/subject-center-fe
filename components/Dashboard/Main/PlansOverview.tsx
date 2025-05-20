"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for programmatic navigation

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
import { siteConfig } from "@/config/site";
import GenericButton from "@/components/Common/GenericButton";

interface PlansOverviewProps {
  className?: string;
  plans: Plan[];
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

const PlansOverview: React.FC<PlansOverviewProps> = React.memo(
  ({ className, plans, onUpdatePlanName, onOpenDeleteModal, onAddPlan }) => {
    const router = useRouter(); // Initialize router for navigation
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleEditClick = useCallback((plan: Plan) => {
      setEditingPlan(plan);
      setIsEditModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
      setIsEditModalOpen(false);
      setEditingPlan(null);
    }, []);

    const handleSubmitEdit = useCallback(
      (newName: string) => {
        if (editingPlan) onUpdatePlanName(editingPlan.id ?? "", newName);
        handleCloseModal();
      },
      [editingPlan, onUpdatePlanName],
    );

    const handleAddPlan = useCallback(() => {
      setIsAddMethodModalOpen(true);
    }, []);

    const handleMethodSelect = useCallback((method: string) => {
      setIsAddMethodModalOpen(false);
      if (method === "custom") setIsCustomModalOpen(true);
      else if (method === "select-subjects") setIsGuideModalOpen(true);
      else if (method === "import-json") setIsImportModalOpen(true);
    }, []);

    const handleImportJsonSubmit = useCallback(
      async (file: File) => {
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
            onAddPlan(resultData.plan);
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
              {
                status: "FAILED",
                message: "An error occurred while importing.",
              },
            ],
          });
          setIsImportModalOpen(false);
          setIsResultModalOpen(true);
        }
      },
      [onAddPlan],
    );

    const defaultSummary: Credits = useMemo(
      () => ({
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
      }),
      [],
    );

    const filteredPlans = useMemo(() => {
      return plans.filter((plan) =>
        plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [plans, searchTerm]);

    const totalItems = filteredPlans.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlans = useMemo(
      () => filteredPlans.slice(indexOfFirstItem, indexOfLastItem),
      [filteredPlans, indexOfFirstItem, indexOfLastItem],
    ).map((plan, index, array) => {
      const summary = plan.summary ?? defaultSummary;
      const isLastRow = index === array.length - 1;
      const progress =
        summary.totalCredits > 0
          ? (summary.totalCreditsCompleted / summary.totalCredits) * 100
          : 0;
      // const progressColor = `bg-color-P${Math.floor(progress)}`;
      const progressColor = `bg-color-P50`;
      return {
        ...plan,
        progress,
        progressColor,
        isLastRow,
      };
    });

    const handleRowClick = useCallback(
      (planId: string) => {
        router.push(siteConfig.routers.planDetails(planId));
      },
      [router],
    );

    return (
      <motion.div
        animate="visible"
        className={`flex-1  w-full ${className ?? ""}`}
        custom="left"
        initial="hidden"
        variants={slideInVariants}
      >
        <div className="bg-color-1 rounded-2xl p-4 sm:p-6 shadow-lg shadow-color-15/50 w-full mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-color-15 text-xl sm:text-2xl font-semibold">
              Plans Overview
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <GenericInputSearch
                className="w-full sm:w-64 min-w-[270px]"
                placeholder="Search Plans..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <GenericButton onClick={handleAddPlan}>
                <PlusIcon className="w-6 h-6" />
              </GenericButton>
            </div>
          </div>
          <div className="bg-color-1 rounded-lg p-4 mb-4">
            <p className="text-color-15 text-sm">Total Plans</p>
            <p className="text-color-15 text-lg sm:text-2xl font-semibold">
              {filteredPlans.length}
            </p>
          </div>
          <div className="mt-6">
            <h4 className="text-color-15 text-lg sm:text-xl font-medium mb-2">
              Plans Summary
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-color-15 table-auto">
                <thead className="bg-color-6 text-color-15 ">
                  <tr>
                    <th className="p-3 sm:p-4 min-w-[150px] border border-color-15">
                      Plan Name
                    </th>
                    <th className="p-3 sm:p-4 min-w-[100px] border border-color-15">
                      Subjects
                    </th>
                    <th className="p-3 sm:p-4 min-w-[100px] border border-color-15">
                      Credits
                    </th>
                    <th className="p-3 sm:p-4 min-w-[80px] border border-color-15">
                      GPA
                    </th>
                    <th className="p-3 sm:p-4 min-w-[150px] border border-color-15">
                      Progress
                    </th>
                    <th className="p-3 sm:p-4 min-w-[100px] border border-color-15">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlans.length === 0 ? (
                    <tr>
                      <td
                        className="p-3 sm:p-4 text-center text-color-15"
                        colSpan={6}
                      >
                        {searchTerm
                          ? "No plans match your search."
                          : "No plans available. Click '+' to create a new one."}
                      </td>
                    </tr>
                  ) : (
                    currentPlans.map((plan, index) => {
                      const summary = plan.summary ?? defaultSummary;
                      const isLastRow = index === currentPlans.length - 1;
                      // const progress =
                      //   summary.totalCredits > 0
                      //     ? (summary.totalCreditsCompleted /
                      //         summary.totalCredits) *
                      //       100
                      //     : 0;
                      const progress = plan.progress;

                      // const progressColor = `bg-color-P${Math.floor(progress)}`;
                      const progressColor = plan.progressColor;

                      return (
                        <tr
                          key={plan.id}
                          className="border border-color-15 hover:bg-color-4 transition-all duration-200 cursor-pointer"
                          onClick={() => handleRowClick(plan.id ?? "")}
                        >
                          <td
                            className={`border border-color-15 p-3 sm:p-4 text-color-15 ${isLastRow ? "rounded-bl-lg" : ""}`}
                          >
                            {plan.name}
                          </td>
                          <td className="border border-color-15 p-3 sm:p-4">
                            {summary.totalSubjects} subjects
                          </td>
                          <td className="border border-color-15 p-3 sm:p-4">
                            {summary.totalCredits} credits
                          </td>
                          <td className="border border-color-15 p-3 sm:p-4">
                            <span
                              className={`text-color-P${Math.floor((summary.currentCPA / 4) * 100)}`}
                            >
                              {summary.currentCPA.toFixed(4)}
                            </span>
                          </td>
                          <td className="border border-color-15 p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-color-15  overflow-hidden">
                                <div
                                  className={`h-full ${progressColor}  transition-all duration-300`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-color-15 text-xs">
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className={` p-3 sm:p-4 flex gap-2`}>
                            <button
                              aria-label="Edit plan name"
                              className=" text-color-15 hover:text-color-B7 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleEditClick(plan);
                              }}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              aria-label="Delete plan"
                              className="text-color-15 hover:text-color-R7 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
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
          // onClose={() => {
          //   setIsResultModalOpen(false);
          // }}
        />
      </motion.div>
    );
  },
);

PlansOverview.displayName = "PlansOverview";

export default PlansOverview;
