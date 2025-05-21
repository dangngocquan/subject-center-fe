"use client";

import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";

import GPAChart from "./GPAChart";
import MarksGraph from "./MarksGraph";
import PlansOverview from "./PlansOverview";
import StatsSection from "./StatsSection";
import SubjectsList from "./SubjectsList";
import PlanGraph from "./PlanGraph/PlanGraph";

import { Plan, PlanDetails, PlanItem } from "@/types/plan";
import { usePlanDetails } from "@/hooks/usePlanDetails";

interface MainProps {
  selectedPlan: { id: string; name: string } | null;
  planDetails: PlanDetails | null;
  plans: Plan[];
  setPlanDetails: (details: PlanDetails | null) => void;
  onUpdatePlanName: (planId: string, newName: string) => void;
  onOpenDeleteModal: (planId: string) => void;
  onAddPlan: (plan: Plan) => void;
}

const Main: React.FC<MainProps> = ({
  selectedPlan,
  planDetails,
  plans,
  setPlanDetails,
  onUpdatePlanName,
  onOpenDeleteModal,
  onAddPlan,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    planDetails: fetchedPlanDetails,
    loading,
    error,
  } = usePlanDetails(selectedPlan?.id, refreshTrigger);

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

  const reloadData = useCallback(() => {
    if (!selectedPlan?.id) return;
    setRefreshTrigger((prev) => prev + 1);
  }, [selectedPlan?.id]);

  React.useEffect(() => {
    if (fetchedPlanDetails && !error) {
      setPlanDetails(fetchedPlanDetails);
    }
  }, [fetchedPlanDetails, error, setPlanDetails]);

  if (!selectedPlan) {
    return (
      <PlansOverview
        className="h-[90%]"
        plans={plans.filter((plan) => plan.id !== undefined)}
        onAddPlan={onAddPlan}
        onOpenDeleteModal={onOpenDeleteModal}
        onUpdatePlanName={onUpdatePlanName}
      />
    );
  }

  return (
    <motion.div
      animate="visible"
      className="grid grid-cols-1 sm:p-4 gap-4"
      custom="left"
      initial="hidden"
      variants={slideInVariants}
    >
      <div className="flex flex-wrap gap-2 mb-4 shadow-lg shadow-color-15/50 rounded-lg">
        <button
          className={`flex-1 py-2 px-3 m-3 rounded-lg text-sm ${
            activeTab === "overview"
              ? "bg-color-6 text-color-15"
              : "bg-color-1 text-color-15"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-2 px-3 m-3 rounded-lg text-sm ${
            activeTab === "marks"
              ? "bg-color-6 text-color-15"
              : "bg-color-1 text-color-15"
          }`}
          onClick={() => setActiveTab("marks")}
        >
          CPA Marks
        </button>
        <button
          className={`flex-1 py-2 px-3 m-3 rounded-lg text-sm ${
            activeTab === "graph"
              ? "bg-color-6 text-color-15"
              : "bg-color-1 text-color-15"
          }`}
          onClick={() => setActiveTab("graph")}
        >
          Plan Graph
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="w-full sm:w-1/2 min-h-[300px]">
              <GPAChart currentCPA={planDetails?.credits.currentCPA || 0} />
            </div>
            <div className="w-full sm:w-1/2 min-h-[300px]">
              <StatsSection
                currentCPA={planDetails?.credits.currentCPA || 0}
                totalCredits={planDetails?.credits.totalCredits || 0}
                totalCreditsCanImprovement={
                  planDetails?.credits.totalCreditsCanImprovement || 0
                }
                totalCreditsCompleted={
                  planDetails?.credits.totalCreditsCompleted || 0
                }
                totalCreditsIncomplete={
                  planDetails?.credits.totalCreditsIncomplete || 0
                }
                totalSubjects={planDetails?.credits.totalSubjects || 0}
                totalSubjectsCanImprovement={
                  planDetails?.credits.totalSubjectsCanImprovement || 0
                }
                totalSubjectsCompleted={
                  planDetails?.credits.totalSubjectsCompleted || 0
                }
                totalSubjectsIncomplete={
                  planDetails?.credits.totalSubjectsIncomplete || 0
                }
              />
            </div>
          </div>
          <SubjectsList
            items={
              (planDetails?.credits.items || []).filter(
                (item) => item.id !== undefined,
              ) as PlanItem[]
            }
            planId={selectedPlan?.id || null}
            onDataChange={reloadData}
          />
        </div>
      )}

      {activeTab === "marks" && <MarksGraph cpa={planDetails?.cpa} />}
      {activeTab === "graph" && (
        <PlanGraph
          items={
            (planDetails?.credits.items || []).filter(
              (item) => item.id !== undefined,
            ) as PlanItem[]
          }
          planId={selectedPlan?.id || null} // Thêm planId
          onDataChange={reloadData} // Thêm onDataChange
        />
      )}
    </motion.div>
  );
};

export default Main;
