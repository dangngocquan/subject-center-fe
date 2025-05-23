import React from "react";

import { CourseItem } from "../types";

interface CourseItemWithStatus extends CourseItem {
  selected: boolean;
}

interface StatisticsPanelProps {
  courses: CourseItemWithStatus[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ courses }) => {
  const totalCourses = new Set(courses.map((course) => course.courseCode)).size;
  const selectedCourses = new Set(
    courses
      .filter((course) => course.selected)
      .map((course) => course.courseCode),
  ).size;

  return (
    <div className="border border-color-15 bg-color-1 rounded-2xl p-3 sm:p-4 shadow-lg shadow-color-15/20 w-full">
      <h3 className="text-color-15 text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        Statistics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-color-1 border border-color-15 rounded-lg p-2 sm:p-3">
          <p className="text-color-15 text-xs uppercase font-medium">
            Overview
          </p>
          <div className="flex justify-between items-center mt-1 sm:mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-color-15 text-base sm:text-lg font-semibold"
                style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
              >
                {totalCourses || 0}
              </p>
              <p
                className="text-color-15 text-[10px] sm:text-xs"
                style={{ fontSize: "clamp(10px, 1.8vw, 12px)" }}
              >
                Courses
              </p>
            </div>
          </div>
        </div>
        <div className="border border-color-15 bg-color-1 rounded-lg p-2 sm:p-3 border-l-4 border-color-G7">
          <p className="text-color-G7 text-xs uppercase font-medium">
            Selected
          </p>
          <div className="flex justify-between items-center mt-1 sm:mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-color-G7 text-base sm:text-lg font-semibold"
                style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
              >
                {selectedCourses || 0}
              </p>
              <p
                className="text-color-G7 text-[10px] sm:text-xs"
                style={{ fontSize: "clamp(10px, 1.8vw, 12px)" }}
              >
                Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
