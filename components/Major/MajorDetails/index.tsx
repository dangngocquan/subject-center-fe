"use client";

import { AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

import PlanModal from "../PlanModal";
import ResultModal from "../ResultModal";

import MajorDetailHeader from "./MajorDetailHeader";
import MajorDetailTable from "./MajorDetailTable";
import MajorDetailTooltips from "./MajorDetailTooltips";
import { buildTree, findRequiredSubjects, flattenTree } from "./majorUtils";
import CurriculumGraph from "./MajorGraph/CurriculumGraph";

import { useMajorDetail } from "@/hooks/useMajorDetail";
import { createNewPlan } from "@/service/plan.api";
import { MajorItem, MajorItemWithChildren } from "@/types/major";
import LoadingModal from "@/components/LoadingModal";

interface MajorDetailProps {
  id: string;
}

const MajorDetail: React.FC<MajorDetailProps> = ({ id }) => {
  const { major, loading, error } = useMajorDetail(Number(id));
  const [data, setData] = useState<MajorItem[]>([]);
  const [tree, setTree] = useState<MajorItemWithChildren[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [result, setResult] = useState<
    {
      name: string;
      code: string;
      status: "SUCCEEDED" | "FAILED";
      message: string;
    }[]
  >([]);
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    if (major) {
      const items = major.items;
      setData(items);
      setTree(buildTree(items));
      setSelected(new Set());
    } else {
      const mockData: MajorItem[] = [];
      setData(mockData);
      setTree(buildTree(mockData));
      setSelected(new Set());
    }
  }, [major]);

  const toggleExpand = (genCode: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(genCode)) {
      newExpanded.delete(genCode);
    } else {
      newExpanded.add(genCode);
    }
    setExpanded(newExpanded);
  };

  const toggleAllExpand = () => {
    const expandableNodes = data
      .filter((item) => !item.isLeaf)
      .map((item) => item.genCode);
    const allExpanded = expandableNodes.every((genCode) =>
      expanded.has(genCode),
    );
    setExpanded(
      allExpanded ? new Set() : new Set(data.map((item) => item.genCode)),
    );
  };

  const handleSelection = (item: MajorItemWithChildren, isChecked: boolean) => {
    if (!isEditMode) return;
    const newSelected = new Set(selected);
    if (isChecked) {
      newSelected.add(item.genCode);
    } else {
      newSelected.delete(item.genCode);
    }
    setSelected(newSelected);
  };

  const toggleMode = () => setIsEditMode((prev) => !prev);
  const resetSelected = () => setSelected(new Set());
  const selectAllRequired = () => setSelected(findRequiredSubjects(tree, data));
  const openPlanModal = () => setIsPlanModalOpen(true);
  const closePlanModal = () => setIsPlanModalOpen(false);

  const handlePlanCreated = ({
    planName,
    result,
  }: {
    planName: string;
    result: {
      name: string;
      code: string;
      status: "SUCCEEDED" | "FAILED";
      message: string;
    }[];
  }) => {
    setPlanName(planName);
    setResult(result);
    setIsResultOpen(true);
  };

  const closeResultModal = () => {
    setIsResultOpen(false);
    setResult([]);
    setPlanName("");
  };

  const totalCredits = useMemo(
    () =>
      data
        .filter((item) => selected.has(item.genCode) && item.credit)
        .reduce((sum, item) => sum + (item.credit || 0), 0),
    [data, selected],
  );

  const flatData = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);
  const expandableNodes = useMemo(
    () => data.filter((item) => !item.isLeaf).map((item) => item.genCode),
    [data],
  );
  const allExpanded = expandableNodes.every((genCode) => expanded.has(genCode));

  if (loading) return <LoadingModal isOpen={loading} />;
  if (error) return <p className="text-red-500">An error occurred: {error}</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#0A1A2F]">
      <MajorDetailHeader
        allExpanded={allExpanded}
        isEditMode={isEditMode}
        majorName={String(major?.name)}
        totalCredits={totalCredits}
        onOpenPlanModal={openPlanModal}
        onResetSelected={resetSelected}
        onSelectAllRequired={selectAllRequired}
        onToggleAllExpand={toggleAllExpand}
        onToggleMode={toggleMode}
      />

      <AnimatePresence>
        {isPlanModalOpen && (
          <PlanModal
            isOpen={isPlanModalOpen}
            majorItems={major?.items ?? []}
            selected={selected}
            tree={tree}
            onClose={closePlanModal}
            onCreatePlan={(plan) => createNewPlan(plan)}
            onPlanCreated={handlePlanCreated}
          />
        )}
        {isResultOpen && (
          <ResultModal
            isOpen={isResultOpen}
            planName={planName}
            result={result}
            onClose={closeResultModal}
          />
        )}
      </AnimatePresence>

      <MajorDetailTooltips />
      <MajorDetailTable
        expanded={expanded}
        flatData={flatData}
        isEditMode={isEditMode}
        selected={selected}
        onHandleSelection={handleSelection}
        onToggleExpand={toggleExpand}
      />
      <div>
        <CurriculumGraph major={major} />
      </div>
    </div>
  );
};

export default MajorDetail;
