"use client";

import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

import LoadingModal from "../LoadingModal";

import PlanHeader from "./Header/Header";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";
import ConfirmDeleteModal from "./Sidebar/SidebarConfirmDeleteModal";
import NotificationModal from "./Sidebar/SidebarNotificationModal";

import { usePlans } from "@/hooks/usePlans";
import { apiUpsertPlan, deletePlan } from "@/service/plan.api";
import { Plan, PlanDetails } from "@/types/plan";

interface DashboardProps {
  initialPlanId?: string | null; // Optional prop to set initial selected plan from route
}

const Dashboard: React.FC<DashboardProps> = ({ initialPlanId = null }) => {
  const router = useRouter(); // Initialize router
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    isSuccess: boolean;
  }>({
    isOpen: false,
    message: "",
    isSuccess: false,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    planId: string | null;
  }>({
    isOpen: false,
    planId: null,
  });
  // const [lastRefetch, setLastRefetch] = useState<number | null>(null);

  const { plans, loading, error } = usePlans(searchQuery);

  // Initialize selectedPlan based on initialPlanId from route
  useEffect(() => {
    if (plans && initialPlanId) {
      console.log(1);
      const plan = plans.find((p) => p.id === initialPlanId) || null;
      setSelectedPlan(plan);
    }
  }, [plans, initialPlanId]);

  useEffect(() => {
    if (plans) {
      console.log(2);
      const updatedPlans = plans.map((plan) => ({ ...plan }));
      setLocalPlans(updatedPlans);
    }
  }, [plans]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      setIsSidebarVisible(true);
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        setIsSidebarVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [isSidebarOpen]);

  const mainRef = useRef(null);
  useInView(mainRef, { once: true, margin: "-100px" });

  const handleOpenDeleteModal = (planId: string) => {
    setDeleteModal({ isOpen: true, planId });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, planId: null });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.planId) {
      try {
        const response = await deletePlan(Number(deleteModal.planId));
        if (!response.isBadRequest) {
          setLocalPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== deleteModal.planId),
          );
          if (selectedPlan?.id === deleteModal.planId) {
            router.push("/plans"); // Redirect to overview after deletion
            setSelectedPlan(null);
            setPlanDetails(null);
          }
        } else {
          setModal({
            isOpen: true,
            message: response.message || "Failed to delete the plan!",
            isSuccess: false,
          });
        }
      } catch (error) {
        setModal({
          isOpen: true,
          message: "An error occurred while deleting the plan!",
          isSuccess: false,
        });
      }
    }
    handleCloseDeleteModal();
  };

  const handleUpdatePlanName = async (planId: string, newName: string) => {
    try {
      const planToUpdate = localPlans.find((plan) => plan.id === planId);
      if (!planToUpdate) return;

      setLocalPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId ? { ...plan, name: newName } : plan,
        ),
      );
      if (selectedPlan?.id === planId) {
        setSelectedPlan((prev) => (prev ? { ...prev, name: newName } : null));
      }

      const response = await apiUpsertPlan({
        id: planId,
        name: newName,
        items: [],
      });

      if (!response.isBadRequest) {
        setModal({
          isOpen: true,
          message: "Plan name updated successfully!",
          isSuccess: true,
        });
      } else {
        setModal({
          isOpen: true,
          message: response.message || "Failed to update plan name!",
          isSuccess: false,
        });
        setLocalPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === planId ? { ...plan, name: planToUpdate.name } : plan,
          ),
        );
        if (selectedPlan?.id === planId) {
          setSelectedPlan((prev) =>
            prev ? { ...prev, name: planToUpdate.name } : null,
          );
        }
      }
    } catch (error) {
      setModal({
        isOpen: true,
        message: "An error occurred while updating the plan name!",
        isSuccess: false,
      });
      const planToUpdate = localPlans.find((plan) => plan.id === planId);
      if (planToUpdate) {
        setLocalPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === planId ? { ...plan, name: planToUpdate.name } : plan,
          ),
        );
        if (selectedPlan?.id === planId) {
          setSelectedPlan((prev) =>
            prev ? { ...prev, name: planToUpdate.name } : null,
          );
        }
      }
    }
  };

  const handleAddPlan = (plan: Plan) => {
    setLocalPlans((prevPlans) => [...prevPlans, plan]);
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "", isSuccess: false });
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className={`bg-black text-white min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative ${
        isSidebarOpen ? "overflow-hidden" : ""
      }`}
    >
      <PlanHeader
        selectedPlanName={selectedPlan?.name}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {isSidebarVisible && (
        <div
          className={`fixed inset-0 bg-black/70 z-40 md:hidden cursor-pointer transition-opacity duration-300 ease-in-out ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={handleOverlayKeyDown}
        />
      )}
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {initialPlanId && (
          <div
            className={`w-full md:w-64 md:flex-shrink-0 transition-transform duration-300 ease-in-out ${
              isSidebarVisible
                ? `${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 w-4/5 max-w-xs h-[100dvh] z-50 md:static md:h-[calc(100vh-100px)] md:translate-x-0 md:block`
                : "fixed top-0 left-0 -translate-x-full md:static md:h-[calc(100vh-100px)] md:translate-x-0 md:block"
            }`}
          >
            <Sidebar
              plans={localPlans}
              searchQuery={searchQuery}
              selectedPlanId={selectedPlan?.id}
              setSearchQuery={setSearchQuery}
              onAddPlan={handleAddPlan}
              onDeletePlan={handleConfirmDelete}
              onOpenDeleteModal={handleOpenDeleteModal}
              onUpdatePlanName={handleUpdatePlanName}
            />
          </div>
        )}
        <div
          ref={mainRef}
          className={`flex-1 transition-opacity duration-300 ${
            isSidebarOpen
              ? "pointer-events-none opacity-50 md:pointer-events-auto md:opacity-100"
              : "opacity-100"
          }`}
        >
          {loading ? (
            <p className="text-gray-400">Loading plans...</p>
          ) : error ? (
            <p className="text-red-400">Error loading plans: {error}</p>
          ) : (
            <Main
              planDetails={planDetails}
              plans={localPlans}
              selectedPlan={
                selectedPlan && selectedPlan.id && selectedPlan.name
                  ? { id: selectedPlan.id, name: selectedPlan.name }
                  : null
              }
              setPlanDetails={setPlanDetails}
              onAddPlan={handleAddPlan}
              onOpenDeleteModal={handleOpenDeleteModal}
              onUpdatePlanName={handleUpdatePlanName}
            />
          )}
        </div>
      </div>
      <LoadingModal isOpen={loading} />
      <NotificationModal
        isOpen={modal.isOpen}
        isSuccess={modal.isSuccess}
        message={modal.message}
        onClose={closeModal}
      />
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;
