import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import PlanCard from "./PlanCard";
import EditPlanModal from "./SidebarEditPlanModal";
import AddPlanMethodModal from "./AddPlanMethodModal";
import { Plan } from "@/types/plan";
import { useRouter } from "next/navigation";
import CustomPlanModal from "./CustomPlanModal";
import SelectSubjectsGuideModal from "./SelectSubjectsGuideModal";
import ImportJsonModal from "./ImportJsonModal";
import ImportResultModal from "./ImportResultModal";
import { createPlanByImportJSON } from "@/service/plan.api";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  plans: Plan[];
  selectedPlanId: string | null | undefined;
  onSelectPlan: (planId: string | null) => void;
  onDeletePlan: (planId: string) => void;
  onUpdatePlanName: (planId: string, newName: string) => void;
  onOpenDeleteModal: (planId: string) => void;
  onAddPlan: (plan: Plan) => void;
}

const ShowMoreToggle: React.FC<{ showAll: boolean; onToggle: () => void }> = ({
  showAll,
  onToggle,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="py-4 text-center cursor-pointer bg-gradient-to-b from-white/10 to-gray-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors duration-300">
          {showAll ? "Show Less" : "Show More"}
        </span>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  plans,
  selectedPlanId,
  onSelectPlan,
  onUpdatePlanName,
  onOpenDeleteModal,
  onAddPlan,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const router = useRouter();
  const MAX_INITIAL_PLANS = 10;

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

  const handleDeleteClick = (planId: string) => {
    onOpenDeleteModal(planId);
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
      console.log(1, { response });
      if (!response.isBadRequest && response.data) {
        const resultData = {
          plan: {
            id: response.data.plan.id?.toString(),
            name: response.data.plan.name,
            // accountId: response.data.accountId.toString(),
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
      console.log(error);
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

  const filteredPlans = plans.filter((plan) =>
    (plan.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 bg-gray-900/80 shadow-lg rounded-2xl flex flex-col overflow-hidden h-auto md:h-[calc(100vh-100px)]">
      <div className="p-4">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            placeholder="Search Plans..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          aria-label="Add a new plan"
          className="w-full bg-cyan-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-cyan-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          type="button"
          onClick={handleAddPlan}
        >
          Add Plan
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {filteredPlans
            .slice(0, showAll ? undefined : MAX_INITIAL_PLANS)
            .map((plan) => (
              <li key={plan.id} className="flex items-center gap-2">
                <PlanCard
                  isSelected={selectedPlanId === plan.id}
                  plan={plan}
                  onClick={() => onSelectPlan(plan.id ?? null)}
                />
                <button
                  aria-label="Edit plan name"
                  className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                  onClick={() => handleEditClick(plan)}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  aria-label="Delete plan"
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  onClick={() => handleDeleteClick(plan.id ?? "")}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
        </ul>
      </div>
      {filteredPlans.length > MAX_INITIAL_PLANS && (
        <ShowMoreToggle
          showAll={showAll}
          onToggle={() => setShowAll(!showAll)}
        />
      )}
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
          router.push("/major");
        }}
      />
      <ImportJsonModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleImportJsonSubmit}
      />
      <ImportResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={importResult}
      />
    </div>
  );
};

export default Sidebar;
