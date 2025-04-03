// components/TimeTableResult.tsx
"use client";
import { useState } from "react";

interface Course {
  courseCode: string;
  courseName: string;
  classCode: string;
  dayOfWeek: number;
  period: number[];
}

interface FilterOptions {
  minCourses: number;
  maxCourses: number;
  minCredits: number;
  maxCredits: number;
}

interface TimeTableResultProps {
  timetables: Course[][];
}

export default function TimeTableResult({ timetables }: TimeTableResultProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    minCourses: 0,
    maxCourses: Infinity,
    minCredits: 0,
    maxCredits: Infinity,
  });

  const filteredTimetables = timetables.filter((timetable) => {
    const courseCount = timetable.length;
    const totalCredits = timetable.reduce((sum) => sum + 3, 0); // Giả định mỗi course 3 tín chỉ
    return (
      courseCount >= filters.minCourses &&
      courseCount <= filters.maxCourses &&
      totalCredits >= filters.minCredits &&
      totalCredits <= filters.maxCredits
    );
  });

  const currentTimetable = filteredTimetables[currentIndex] || [];

  return (
    <div className="w-1/2 p-4">
      <TimeTableResultHeader
        timetables={filteredTimetables}
        currentTimetable={currentTimetable}
        onFilterChange={setFilters}
      />
      <TimeTableResultMain
        timetable={currentTimetable}
        index={currentIndex}
        total={filteredTimetables.length}
        onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentIndex((prev) =>
            Math.min(filteredTimetables.length - 1, prev + 1)
          )
        }
      />
    </div>
  );
}

interface TimeTableResultHeaderProps {
  timetables: Course[][];
  currentTimetable: Course[];
  onFilterChange: (filters: (prev: FilterOptions) => FilterOptions) => void;
}

function TimeTableResultHeader({
  timetables,
  currentTimetable,
  onFilterChange,
}: TimeTableResultHeaderProps) {
  const totalTimetables = timetables.length;
  const courseCount = currentTimetable.length;
  const totalCredits = courseCount * 3; // Giả định mỗi course 3 tín chỉ

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold">Timetable Statistics</h2>
      <p>Total timetables: {totalTimetables}</p>
      <p>Current courses: {courseCount}</p>
      <p>Total credits: {totalCredits}</p>
      <div className="mt-2">
        <input
          type="number"
          placeholder="Minimum courses"
          onChange={(e) =>
            onFilterChange((prev) => ({
              ...prev,
              minCourses: Number(e.target.value),
            }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Maximum courses"
          onChange={(e) =>
            onFilterChange((prev) => ({
              ...prev,
              maxCourses: Number(e.target.value) || Infinity,
            }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Minimum credits"
          onChange={(e) =>
            onFilterChange((prev) => ({
              ...prev,
              minCredits: Number(e.target.value),
            }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Maximum credits"
          onChange={(e) =>
            onFilterChange((prev) => ({
              ...prev,
              maxCredits: Number(e.target.value) || Infinity,
            }))
          }
          className="border p-1"
        />
      </div>
      <button className="mt-2 bg-yellow-500 text-white p-2 rounded">
        Save Timetable
      </button>
    </div>
  );
}

interface TimeTableResultMainProps {
  timetable: Course[];
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function TimeTableResultMain({
  timetable,
  index,
  total,
  onPrev,
  onNext,
}: TimeTableResultMainProps) {
  if (!timetable.length) {
    return (
      <p className="text-center">No timetables available to display.</p>
    );
  }

  return (
    <div>
      <h3 className="font-bold">Timetable #{index + 1}</h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Course</th>
            <th className="border p-2">Day</th>
            <th className="border p-2">Period</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{item.courseName}</td>
              <td className="border p-2">{item.dayOfWeek}</td>
              <td className="border p-2">{item.period.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Previous
        </button>
        <p>
          {index + 1}/{total}
        </p>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
