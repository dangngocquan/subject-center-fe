// components/TimeTable/TimeTableResult/TimeTableGrid.tsx
import React from "react";
import { motion } from "framer-motion";

import { TimeTable } from "../types";

interface TimeTableGridProps {
  timetable: TimeTable;
  index: number;
  colorMap: {
    [courseCode: string]: { bg: string; border: string; hoverShadow: string };
  };
}

const TimeTableGrid: React.FC<TimeTableGridProps> = ({
  timetable,
  index,
  colorMap,
}) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Tính maxLessonPerDay từ timetable
  let maxLessonPerDay = 10;
  timetable.courses.forEach((course) => {
    const maxPeriod = Math.max(...course.period);
    if (maxPeriod > maxLessonPerDay) {
      maxLessonPerDay = maxPeriod;
    }
  });
  const periods = Array.from({ length: maxLessonPerDay }, (_, i) => i + 1);

  // Tạo lưới maxLessonPerDay x 7
  const grid: (TimeTable["courses"][number] | null)[][] = Array.from(
    { length: maxLessonPerDay },
    () => Array(7).fill(null)
  );

  // Điền các course vào lưới
  timetable.courses.forEach((course) => {
    const day = course.dayOfWeek; // 0-6
    course.period.forEach((period) => {
      const periodIndex = period - 1; // Tiết 1 -> index 0
      if (periodIndex < maxLessonPerDay && day < 7) {
        grid[periodIndex][day] = course;
      }
    });
  });

  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-2 text-sm">Period</th>
              {daysOfWeek.map((day, idx) => (
                <th key={idx} className="border border-gray-700 p-2 text-sm">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, periodIdx) => (
              <tr key={periodIdx} className="hover:bg-gray-800">
                <td className="border border-gray-700 p-2 text-center text-sm">
                  Period {period}
                </td>
                {grid[periodIdx].map((course, dayIdx) => {
                  const color = course ? colorMap[course.courseCode] : null;
                  return (
                    <td
                      key={dayIdx}
                      className={`border border-gray-700 p-2 text-center text-sm ${
                        color ? `${color.bg} ${color.border}` : ""
                      }`}
                    >
                      {course ? (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-2 rounded-lg shadow-lg ${color?.hoverShadow || ""} transition-shadow duration-300`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="font-semibold text-white">
                            {course.courseCode} - {course.classCode}
                          </p>
                          <p className="text-xs text-gray-200">
                            {course.courseName}
                          </p>
                        </motion.div>
                      ) : (
                        ""
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTableGrid;
