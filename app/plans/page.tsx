"use client";

import React from "react";

import Dashboard from "@/components/Dashboard/Dashboard";

const PlansPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Dashboard initialPlanId={null} />
    </div>
  );
};

export default PlansPage;
