"use client";

import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";

import GPAChart from "./GPAChart";
import MarksGraph from "./MarksGraph";
import PlansOverview from "./PlansOverview";
import StatsSection from "./StatsSection";
import SubjectsList from "./SubjectsList";

import { Plan, PlanDetails, PlanItem } from "@/types/plan";
import { usePlanDetails } from "@/hooks/usePlanDetails";

interface MainProps {
  selectedPlan: { id: string; name: string } | null;
  planDetails: PlanDetails | null;
  plans: Plan[];
  setPlanDetails: (details: PlanDetails | null) => void; // Thêm prop để cập nhật planDetails
}

const Main: React.FC<MainProps> = ({
  selectedPlan,
  planDetails,
  plans,
  setPlanDetails,
}) => {
  const [activeTab, setActiveTab] = useState("overview"); // Add state for active tab

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

  const planDetailsResponse = usePlanDetails(selectedPlan?.id);

  useEffect(() => {
    if (planDetailsResponse && !planDetailsResponse.error) {
      setPlanDetails(planDetailsResponse.planDetails);
    }
  }, [planDetailsResponse, setPlanDetails]);

  const reloadData = useCallback(() => {
    if (planDetailsResponse && !planDetailsResponse.error) {
      setPlanDetails(planDetailsResponse.planDetails); // Update planDetails
    }
  }, [planDetailsResponse, setPlanDetails]);

  useEffect(() => {
    reloadData(); // Ensure data is loaded initially
  }, [reloadData]);

  if (!selectedPlan) {
    return (
      <PlansOverview
        plans={
          plans.filter((plan) => plan.id !== undefined) as {
            id: string;
            name: string;
            createdAt: string;
          }[]
        }
        selectedPlan={selectedPlan}
      />
    );
  }

  return (
    <motion.div
      animate="visible"
      className="grid grid-cols-1 gap-8"
      custom="left"
      initial="hidden"
      variants={slideInVariants}
    >
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "overview"
              ? "bg-cyan-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "marks"
              ? "bg-cyan-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("marks")}
        >
          CPA Marks
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div>
          <div className="flex">
            <div className="flex-[6]">
              <SubjectsList
                items={
                  (planDetails?.credits.items || []).filter(
                    (item) => item.id !== undefined
                  ) as PlanItem[]
                }
                planId={selectedPlan?.id || null}
                onDataChange={reloadData} // Pass callback to refresh data
              />
            </div>

            <div className="flex flex-col flex-[3] ml-2">
              <GPAChart currentCPA={planDetails?.credits.currentCPA || 0} />
              <StatsSection
                totalCredits={planDetails?.credits.totalCredits || 0}
                totalSubjects={planDetails?.credits.totalSubjects || 0}
                totalSubjectsCompleted={
                  planDetails?.credits.totalSubjectsCompleted || 0
                }
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "marks" && <MarksGraph cpa={planDetails?.cpa} />}
    </motion.div>
  );
};

export default Main;
