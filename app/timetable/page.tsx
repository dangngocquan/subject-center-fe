"use client";

import React from "react";

import TimeTableManager from "@/components/TimeTableGenerator/TimeTableManager";

const TimetablePage: React.FC = () => {
  return (
    <div className="bg-primary text-primary">
      <TimeTableManager />
    </div>
  );
};

export default TimetablePage;
