"use client";

import React from "react";

import Dashboard from "@/components/Dashboard/Dashboard";

const PlansPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-primary">
      <Dashboard initialPlanId={null} />
    </div>
  );
};

export default PlansPage;
