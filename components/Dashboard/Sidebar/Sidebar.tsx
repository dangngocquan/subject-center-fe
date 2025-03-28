"use client";

import { useMemo, useState, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash"; // Assuming lodash for debouncing; install if needed

import AddPlanMethodModal from "./AddPlanMethodModal";
import EditPlanModal from "./SidebarEditPlanModal";
import PlanCard from "./PlanCard";
import CustomPlanModal from "./CustomPlanModal";
import SelectSubjectsGuideModal from "./SelectSubjectsGuideModal";
import ImportPlanByJsonModal from "./ImportJsonModal";
import ImportPlanResultByJsonModal from "./ImportResultModal";

import { Plan } from "@/types/plan";
import { createPlanByImportJSON } from "@/service/plan.api";
import { siteConfig } from "@/config/site";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  plans: Plan[];
  selectedPlanId: string | null | undefined;
  onDeletePlan: (planId: string) => void;
  onUpdatePlanName: (planId: string, newName: string) => void;
  onOpenDeleteModal: (planId: string) => void;
  onAddPlan: (plan: Plan) => void;
  onNavigate?: (path: string) => void; // New prop for centralized navigation
}

const ShowMoreToggle: React.FC<{
  showAll: boolean;
  onToggle: () => void;
  totalPlans: number;
}> = ({ showAll, onToggle, totalPlans }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gray-900/80 border-t border-gray-800/50">
      <div
        className="flex items-center justify-center gap-2 py-3 px-4 cursor-pointer group hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors duration-200">
          {showAll ? "Show Less" : `Show More (${totalPlans - 10} more)`}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-transform duration-300 ${
            showAll ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  plans,
  selectedPlanId,
  onUpdatePlanName,
  onOpenDeleteModal,
  onAddPlan,
  onNavigate,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [modalState, setModalState] = useState({
    edit: { isOpen: false, plan: null as Plan | null },
    addMethod: false,
    custom: false,
    guide: false,
    import: false,
    result: { isOpen: false, data: null as any },
  });
  const MAX_INITIAL_PLANS = 10;

  // Debounced search handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => setSearchQuery(value), 300),
    [setSearchQuery],
  );

  // Memoized filtered plans
  const filteredPlans = useMemo(
    () =>
      plans.filter((plan) =>
        (plan.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [plans, searchQuery],
  );

  const handleEditClick = (plan: Plan) => {
    setModalState((prev) => ({ ...prev, edit: { isOpen: true, plan } }));
  };

  const handleCloseEditModal = () => {
    setModalState((prev) => ({ ...prev, edit: { isOpen: false, plan: null } }));
  };

  const handleSubmitEdit = (newName: string) => {
    if (modalState.edit.plan) {
      onUpdatePlanName(modalState.edit.plan.id ?? "", newName);
    }
    handleCloseEditModal();
  };

  const handleDeleteClick = (planId: string) => {
    onOpenDeleteModal(planId);
  };

  const handleAddPlan = () => {
    setModalState((prev) => ({ ...prev, addMethod: true }));
  };

  const handleMethodSelect = (method: string) => {
    setModalState((prev) => ({ ...prev, addMethod: false }));
    if (method === "custom") {
      setModalState((prev) => ({ ...prev, custom: true }));
    } else if (method === "select-subjects") {
      setModalState((prev) => ({ ...prev, guide: true }));
    } else if (method === "import-json") {
      setModalState((prev) => ({ ...prev, import: true }));
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
        setModalState((prev) => ({
          ...prev,
          import: false,
          result: { isOpen: true, data: resultData },
        }));
        onAddPlan({
          id: response.data.plan.id?.toString(),
          name: response.data.plan.name,
          items: response.data.plan.items,
        });
      } else {
        setModalState((prev) => ({
          ...prev,
          import: false,
          result: {
            isOpen: true,
            data: {
              plan: { name: "Unknown" },
              result: [{ status: "FAILED", message: response.message }],
            },
          },
        }));
      }
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        import: false,
        result: {
          isOpen: true,
          data: {
            plan: { name: "Unknown" },
            result: [
              {
                status: "FAILED",
                message: "An error occurred while importing.",
              },
            ],
          },
        },
      }));
    }
  };

  return (
    <div className="w-full h-full md:w-64 bg-gray-900/80 shadow-lg rounded-2xl md:rounded-2xl flex flex-col">
      <div className="p-4 md:p-4 border-b border-gray-800/50">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            placeholder="Search Plans..."
            type="text"
            value={searchQuery}
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
          />
        </div>
        {/* <button
          aria-label="Add a new plan"
          className="w-full bg-cyan-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-cyan-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          type="button"
          onClick={handleAddPlan}
        >
          Add Plan
        </button> */}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col">
        <ul className="space-y-2 px-4 py-4 flex-1">
          {filteredPlans
            .slice(0, showAll ? undefined : MAX_INITIAL_PLANS)
            .map((plan) => (
              <li key={plan.id} className="flex items-center gap-2">
                <PlanCard isSelected={selectedPlanId === plan.id} plan={plan} />
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
        {filteredPlans.length > MAX_INITIAL_PLANS && (
          <ShowMoreToggle
            showAll={showAll}
            totalPlans={filteredPlans.length}
            onToggle={() => setShowAll(!showAll)}
          />
        )}
      </div>
      <EditPlanModal
        initialName={modalState.edit.plan?.name ?? ""}
        isOpen={modalState.edit.isOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
      />
      <AddPlanMethodModal
        isOpen={modalState.addMethod}
        onClose={() => setModalState((prev) => ({ ...prev, addMethod: false }))}
        onMethodSelect={handleMethodSelect}
      />
      <CustomPlanModal
        isOpen={modalState.custom}
        onClose={() => setModalState((prev) => ({ ...prev, custom: false }))}
        onSubmit={onAddPlan}
      />
      <SelectSubjectsGuideModal
        isOpen={modalState.guide}
        onClose={() => setModalState((prev) => ({ ...prev, guide: false }))}
        onNavigate={() => {
          setModalState((prev) => ({ ...prev, guide: false }));
          onNavigate?.(`${siteConfig.routers.majors}`); // Delegate navigation to parent
        }}
      />
      <ImportPlanByJsonModal
        isOpen={modalState.import}
        onClose={() => setModalState((prev) => ({ ...prev, import: false }))}
        onSubmit={handleImportJsonSubmit}
      />
      <ImportPlanResultByJsonModal
        isOpen={modalState.result.isOpen}
        result={modalState.result.data}
        // onClose={() =>
        //   setModalState((prev) => ({
        //     ...prev,
        //     result: { isOpen: false, data: null },
        //   }))
        // }
      />
    </div>
  );
};

export default Sidebar;
