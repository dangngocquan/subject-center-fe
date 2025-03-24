import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import LoadingModal from "../LoadingModal";
import Main from "./Main/Main";
import PlanHeader from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import NotificationModal from "./Sidebar/SidebarNotificationModal";
import ConfirmDeleteModal from "./Sidebar/SidebarConfirmDeleteModal";
import { usePlans } from "@/hooks/usePlans";
import { Plan, PlanDetails } from "@/types/plan";
import { apiUpsertPlan, deletePlan } from "@/service/plan.api";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar ẩn mặc định trên mobile
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

  const { plans, loading, error } = usePlans(searchQuery);

  useEffect(() => {
    if (plans) setLocalPlans(plans);
  }, [plans]);

  const mainRef = useRef(null);
  useInView(mainRef, { once: true, margin: "-100px" });

  const handleSelectPlan = (planId: string | null) => {
    if (planId === null) {
      setSelectedPlan(null);
      setPlanDetails(null);
    } else {
      const plan = localPlans.find((p) => p.id === planId) || null;
      setSelectedPlan(plan);
    }
    setIsSidebarOpen(false); // Đóng Sidebar khi chọn plan trên mobile
  };

  const handleSelectOverview = () => {
    setSelectedPlan(null);
    setPlanDetails(null);
    setIsSidebarOpen(false); // Đóng Sidebar trên mobile
  };

  const handlePrevPlan = () => {
    if (!selectedPlan) return;
    const currentIndex = localPlans.findIndex((p) => p.id === selectedPlan.id);
    if (currentIndex > 0) setSelectedPlan(localPlans[currentIndex - 1]);
  };

  const handleNextPlan = () => {
    if (!selectedPlan) return;
    const currentIndex = localPlans.findIndex((p) => p.id === selectedPlan.id);
    if (currentIndex < localPlans.length - 1)
      setSelectedPlan(localPlans[currentIndex + 1]);
  };

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
            prevPlans.filter((plan) => plan.id !== deleteModal.planId)
          );
          if (selectedPlan?.id === deleteModal.planId) {
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
          plan.id === planId ? { ...plan, name: newName } : plan
        )
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
            plan.id === planId ? { ...plan, name: planToUpdate.name } : plan
          )
        );
        if (selectedPlan?.id === planId) {
          setSelectedPlan((prev) =>
            prev ? { ...prev, name: planToUpdate.name } : null
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
            plan.id === planId ? { ...plan, name: planToUpdate.name } : plan
          )
        );
        if (selectedPlan?.id === planId) {
          setSelectedPlan((prev) =>
            prev ? { ...prev, name: planToUpdate.name } : null
          );
        }
      }
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "", isSuccess: false });
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PlanHeader
        isNextDisabled={
          !selectedPlan ||
          localPlans.findIndex((p) => p.id === selectedPlan.id) ===
            localPlans.length - 1
        }
        isPrevDisabled={
          !selectedPlan ||
          localPlans.findIndex((p) => p.id === selectedPlan.id) === 0
        }
        selectedPlanName={selectedPlan?.name}
        onNextPlan={handleNextPlan}
        onPrevPlan={handlePrevPlan}
        onSelectOverview={handleSelectOverview}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {/* Sidebar: Hiển thị luôn trên desktop, chỉ hiển thị khi isSidebarOpen trên mobile */}
        <div
          className={`w-full md:w-64 md:flex-shrink-0 ${
            isSidebarOpen ? "block" : "hidden md:block"
          }`}
        >
          <Sidebar
            plans={localPlans}
            searchQuery={searchQuery}
            selectedPlanId={selectedPlan?.id}
            setSearchQuery={setSearchQuery}
            onDeletePlan={handleConfirmDelete}
            onOpenDeleteModal={handleOpenDeleteModal}
            onSelectPlan={handleSelectPlan}
            onUpdatePlanName={handleUpdatePlanName}
          />
        </div>
        <div ref={mainRef} className="flex-1">
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
