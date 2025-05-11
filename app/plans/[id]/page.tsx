"use client";

import React from "react";
import { useParams } from "next/navigation";

import Dashboard from "@/components/Dashboard/Dashboard";

const PlanDetailPage: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-primary text-color-15">
      <Dashboard initialPlanId={id as string} />
    </div>
  );
};

export default PlanDetailPage;
