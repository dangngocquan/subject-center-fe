"use client";

import React, { useState } from "react";

import { CourseItem } from "../types";

import CustomCourseModal from "./CustomCourseModal";
import ImportJsonModal from "./ImportJsonModal";
import StatisticsPanel from "./StatisticsPanel";
import FeaturesPanel from "./FeaturesPanel";
import CourseList from "./CourseList";
import AddCourseModal from "./AddCourseModal";

import GenericInputSearch from "@/components/Common/GenericInputSearch";

interface CourseItemWithStatus extends CourseItem {
  selected: boolean;
}

interface TimeTableInputProps {
  courses: CourseItemWithStatus[];
  setCourses: (courses: CourseItemWithStatus[]) => void;
  onGenerate: () => void;
  isCalculating: boolean;
}

const TimeTableInput: React.FC<TimeTableInputProps> = ({
  courses,
  setCourses,
  onGenerate,
  isCalculating,
}) => {
  const [modalType, setModalType] = useState<"custom" | "json" | "add" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleCoursesUpdate = (newCourses: CourseItem[]) => {
    const updatedCourses = [
      ...courses,
      ...newCourses.map((course) => ({ ...course, selected: true })),
    ];
    setCourses(updatedCourses);
    setModalType(null);
  };

  const toggleCourseSelection = (courseCode: string) => {
    const isSelected = courses.some(
      (course) => course.courseCode === courseCode && course.selected,
    );
    const updatedCourses = courses.map((course) =>
      course.courseCode === courseCode
        ? { ...course, selected: !isSelected }
        : course,
    );
    setCourses(updatedCourses);
  };

  const toggleAllSelection = () => {
    const allSelected = courses.every((course) => course.selected);
    const updatedCourses = courses.map((course) => ({
      ...course,
      selected: !allSelected,
    }));
    setCourses(updatedCourses);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedCount = new Set(
    courses
      .filter((course) => course.selected)
      .map((course) => course.courseCode),
  ).size;
  const allSelected =
    courses.length > 0 && courses.every((course) => course.selected);

  return (
    <div className="border p-4 bg-gray-900 text-white rounded-lg h-full flex flex-col">
      <div className="flex flex-col justify-between items-start mb-4 shrink-0 gap-4">
        <FeaturesPanel
          allSelected={allSelected}
          isCalculating={isCalculating}
          selectedCourses={selectedCount}
          onAddNewCourses={() => setModalType("add")}
          onGenerate={onGenerate}
          onToggleSelection={toggleAllSelection}
        />
        <StatisticsPanel courses={courses} />
      </div>

      {/* Sử dụng GenericInputSearch với class điều chỉnh */}
      <GenericInputSearch
        className="w-full mb-4 text-gray-300 placeholder-gray-300 border-gray-700"
        placeholder="Search by course code or name..."
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
      />

      <h3 className="font-bold text-cyan-400 shrink-0 mb-2">Course List</h3>
      <CourseList
        courses={filteredCourses}
        setCourses={setCourses}
        toggleCourseSelection={toggleCourseSelection}
      />

      <AddCourseModal
        isOpen={modalType === "add"}
        onClose={() => setModalType(null)}
        onCustom={() => setModalType("custom")}
        onJson={() => setModalType("json")}
      />
      <CustomCourseModal
        isOpen={modalType === "custom"}
        onClose={() => setModalType(null)}
        onSubmit={(newCourse) => handleCoursesUpdate([newCourse])}
      />
      <ImportJsonModal
        isOpen={modalType === "json"}
        onClose={() => setModalType(null)}
        onSubmit={(newCourses) => handleCoursesUpdate(newCourses)}
      />
    </div>
  );
};

export default TimeTableInput;
