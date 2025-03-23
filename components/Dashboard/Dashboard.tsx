import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import LoadingModal from "../LoadingModal";

import Main from "./Main/Main";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";

import { usePlanDetails } from "@/hooks/usePlanDetails";
import { usePlans } from "@/hooks/usePlans";
import { Plan } from "@/types/plan";
import { apiUpsertPlan, deletePlan } from "@/service/plan.api";
import NotificationModal from "./Sidebar/SidebarNotificationModal";
import ConfirmDeleteModal from "./Sidebar/SidebarConfirmDeleteModal";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [localPlans, setLocalPlans] = useState<Plan[]>([]);
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
  const { planDetails } = usePlanDetails(selectedPlan?.id);

  useEffect(() => {
    if (plans) {
      setLocalPlans(plans);
    }
  }, [plans]);

  const mainRef = useRef(null);
  useInView(mainRef, { once: true, margin: "-100px" });

  const handleSelectPlan = (planId: string | null) => {
    if (planId === null) {
      setSelectedPlan(null);
    } else {
      const plan = localPlans.find((p) => p.id === planId) || null;
      setSelectedPlan(plan);
    }
    setIsSidebarOpen(false);
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
          message: "Cập nhật tên plan thành công!",
          isSuccess: true,
        });
      } else {
        setModal({
          isOpen: true,
          message: response.message || "Cập nhật tên plan thất bại!",
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
        message: "Đã có lỗi xảy ra khi cập nhật tên plan!",
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
    <div className="bg-black text-white max-w-7xl mx-auto">
      <div className="flex flex-col">
        <Navbar
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
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex mt-8">
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
          <div ref={mainRef} className="flex-1 ml-8">
            <Main
              planDetails={planDetails}
              plans={localPlans}
              selectedPlan={
                selectedPlan && selectedPlan.id && selectedPlan.name
                  ? { id: selectedPlan.id, name: selectedPlan.name }
                  : null
              }
            />
          </div>
        </div>

        {/* Hiển thị LoadingModal khi đang tải danh sách plan */}
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
    </div>
  );
};

export default Dashboard;
