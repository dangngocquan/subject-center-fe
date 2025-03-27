"use client";

import React from "react";
import { useParams } from "next/navigation";

import Dashboard from "@/components/Dashboard/Dashboard";

const PlanDetailPage: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-black text-white">
      <Dashboard initialPlanId={id as string} />;
    </div>
  );
};

export default PlanDetailPage;
