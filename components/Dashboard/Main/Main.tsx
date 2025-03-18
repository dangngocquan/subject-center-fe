import { motion } from "framer-motion";
import React from "react";

import GPAChart from "./GPAChart";
import MarksGraph from "./MarksGraph";
import PlansOverview from "./PlansOverview";
import StatsSection from "./StatsSection";
import SubjectsList from "./SubjectsList";

import { Plan, PlanDetails } from "@/types/plan";

interface MainProps {
  selectedPlan: { id: string; name: string } | null;
  planDetails: PlanDetails | null;
  plans: Plan[];
}

const Main: React.FC<MainProps> = ({ selectedPlan, planDetails, plans }) => {
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

  if (!selectedPlan) {
    return <PlansOverview plans={plans} selectedPlan={selectedPlan} />;
  }

  return (
    <motion.div
      animate="visible"
      className="grid grid-cols-1 gap-8"
      custom="left"
      initial="hidden"
      variants={slideInVariants}
    >
      <div className="flex">
        <div className="flex-[6]">
          <SubjectsList subjects={planDetails?.credits.items || []} />
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

      <MarksGraph cpa={planDetails?.cpa} />
    </motion.div>
  );
};

export default Main;
