"use client";

import React, { useState, useEffect } from "react";
import TimeTableManager from "@/components/TimeTableGenerator/TimeTableManager";

const TimetablePage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Đảm bảo chỉ render TimeTableManager ở phía client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-primary text-primary">
      {isClient ? <TimeTableManager /> : <div>Loading...</div>}
    </div>
  );
};

export default TimetablePage;
