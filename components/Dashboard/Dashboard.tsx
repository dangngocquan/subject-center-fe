import { useInView } from "framer-motion";
import React, { useRef, useState } from "react";

import Main from "./Main/Main";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";

import { usePlanDetails } from "@/hooks/usePlanDetails";
import { usePlans } from "@/hooks/usePlans";
import { Plan } from "@/types/plan";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { plans, loading, error } = usePlans(searchQuery);
  const { planDetails } = usePlanDetails(selectedPlan?.id);

  const mainRef = useRef(null);
  const isMainInView = useInView(mainRef, { once: true, margin: "-100px" });

  const handleSelectPlan = (planId: string | null) => {
    if (planId === null) {
      setSelectedPlan(null); // Unselect plan khi nhấn Overview
    } else {
      const plan = plans.find((p) => p.id === planId) || null;
      setSelectedPlan(plan);
    }
    setIsSidebarOpen(false);
  };

  const handlePrevPlan = () => {
    if (!selectedPlan) return;
    const currentIndex = plans.findIndex((p) => p.id === selectedPlan.id);
    if (currentIndex > 0) setSelectedPlan(plans[currentIndex - 1]);
  };

  const handleNextPlan = () => {
    if (!selectedPlan) return;
    const currentIndex = plans.findIndex((p) => p.id === selectedPlan.id);
    if (currentIndex < plans.length - 1)
      setSelectedPlan(plans[currentIndex + 1]);
  };

  return (
    <div className="bg-black text-white max-w-7xl mx-auto">
      <div className="flex flex-col">
        <Navbar
          isNextDisabled={
            !selectedPlan ||
            plans.findIndex((p) => p.id === selectedPlan.id) ===
              plans.length - 1
          }
          isPrevDisabled={
            !selectedPlan ||
            plans.findIndex((p) => p.id === selectedPlan.id) === 0
          }
          selectedPlanName={selectedPlan?.name}
          onNextPlan={handleNextPlan}
          onPrevPlan={handlePrevPlan}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex mt-8">
          <Sidebar
            plans={plans}
            searchQuery={searchQuery}
            selectedPlanId={selectedPlan?.id}
            setSearchQuery={setSearchQuery}
            onSelectPlan={handleSelectPlan}
          />
          <div ref={mainRef} className="flex-1 ml-8">
            <Main
              planDetails={planDetails}
              plans={plans}
              selectedPlan={
                selectedPlan && selectedPlan.id && selectedPlan.name
                  ? { id: selectedPlan.id, name: selectedPlan.name }
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
