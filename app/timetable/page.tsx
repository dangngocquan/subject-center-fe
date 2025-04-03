"use client";

import React from "react";

import TimeTableManager from "@/components/TimeTableGenerator/TimeTableManager";

const TimetablePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <TimeTableManager />
    </div>
  );
};

export default TimetablePage;
