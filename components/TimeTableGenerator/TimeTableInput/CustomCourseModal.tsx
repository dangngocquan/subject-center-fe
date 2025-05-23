// components/TimeTable/TimeTableInput/CustomCourseModal.tsx
"use client";

import React, { useState, useRef } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

import { CourseItem } from "../types";

import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";

interface CourseItemWithStatus extends CourseItem {
  selected: boolean;
}

interface CustomCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: CourseItem) => void;
}

const CustomCourseModal: React.FC<CustomCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    classCode: "",
    dayOfWeek: 0,
    period: [1], // Khởi tạo với một tiết mặc định
    credits: "",
  });

  const [errors, setErrors] = useState({
    courseCode: "",
    courseName: "",
    classCode: "",
    period: "",
    credits: "",
  });

  const [newPeriod, setNewPeriod] = useState(""); // State để nhập tiết mới

  const inputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      courseCode: "",
      courseName: "",
      classCode: "",
      period: "",
      credits: "",
    };

    if (!form.courseCode.trim()) {
      newErrors.courseCode = "Course code cannot be empty.";
      isValid = false;
    }
    if (!form.courseName.trim()) {
      newErrors.courseName = "Course name cannot be empty.";
      isValid = false;
    }
    if (!form.classCode.trim()) {
      newErrors.classCode = "Class code cannot be empty.";
      isValid = false;
    }
    if (
      form.period.length === 0 ||
      form.period.some((p) => isNaN(p) || p < 1)
    ) {
      newErrors.period =
        "Period must be a positive number and cannot be empty.";
      isValid = false;
    }
    if (!form.credits.trim() || isNaN(Number(form.credits))) {
      newErrors.credits = "Credits must be a valid number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newCourse: CourseItem = {
        courseCode: form.courseCode,
        courseName: form.courseName,
        classCode: form.classCode,
        dayOfWeek: form.dayOfWeek,
        period: [...form.period],
        credits: Number(form.credits),
      };
      onSubmit(newCourse);
      setForm({
        courseCode: "",
        courseName: "",
        classCode: "",
        dayOfWeek: 0,
        period: [1],
        credits: "",
      });
      setErrors({
        courseCode: "",
        courseName: "",
        classCode: "",
        period: "",
        credits: "",
      });
      setNewPeriod("");
    }
  };

  const addPeriod = () => {
    const periodValue = parseInt(newPeriod.trim());
    if (!isNaN(periodValue) && periodValue >= 1) {
      setForm({ ...form, period: [...form.period, periodValue] });
      setNewPeriod("");
      inputRef.current?.focus();
    }
  };

  const removePeriod = (index: number) => {
    setForm({
      ...form,
      period: form.period.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addPeriod();
    }
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center text-color-1 font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Add Custom Course
        </h3>
        <div className="space-y-4 text-left">
          <div>
            <input
              className="w-full bg-color-1 text-color-15 border border-color-15 rounded-lg p-2"
              placeholder="Course Code"
              type="text"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            />
            {errors.courseCode && (
              <p className="text-color-R7 text-sm mt-1">{errors.courseCode}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-color-1 text-color-15 border border-color-15 rounded-lg p-2"
              placeholder="Course Name"
              type="text"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            />
            {errors.courseName && (
              <p className="text-color-R7 text-sm mt-1">{errors.courseName}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-color-1 text-color-15 border border-color-15 rounded-lg p-2"
              placeholder="Class Code"
              type="text"
              value={form.classCode}
              onChange={(e) => setForm({ ...form, classCode: e.target.value })}
            />
            {errors.classCode && (
              <p className="text-color-R7 text-sm mt-1">{errors.classCode}</p>
            )}
          </div>
          <div>
            <select
              className="w-full bg-color-1 text-color-15 border border-color-15 rounded-lg p-2"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({ ...form, dayOfWeek: parseInt(e.target.value) })
              }
            >
              <option value={0}>Monday</option>
              <option value={1}>Tuesday</option>
              <option value={2}>Wednesday</option>
              <option value={3}>Thursday</option>
              <option value={4}>Friday</option>
              <option value={5}>Saturday</option>
              <option value={6}>Sunday</option>
            </select>
          </div>
          <div>
            <div className="relative w-full bg-color-1 border border-color-15 rounded-lg p-2 min-h-[40px] flex flex-wrap items-center gap-2">
              {form.period.map((period, index) => (
                <div
                  key={index}
                  className="bg-color-6 text-color-15 rounded-full px-2 py-1 text-sm flex items-center"
                >
                  {period}
                  <button
                    className="ml-1 text-color-R5 hover:text-color-R7"
                    onClick={() => removePeriod(index)}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  className="bg-transparent text-color-15 border-none outline-none w-16"
                  min="1"
                  placeholder="Period"
                  type="number"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <GenericButton
                  className="text-sm hover:bg-green-500 hover:text-color-15"
                  onClick={addPeriod}
                >
                  <FaPlus size={12} />
                </GenericButton>
              </div>
            </div>
            {errors.period && (
              <p className="text-color-R7 text-sm mt-1">{errors.period}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-color-1 text-color-15 border border-color-15 rounded-lg p-2"
              placeholder="Credits"
              type="text"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: e.target.value })}
            />
            {errors.credits && (
              <p className="text-color-R7 text-sm mt-1">{errors.credits}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <GenericButton onClick={onClose}>Cancel</GenericButton>
          <GenericButton onClick={handleSubmit}>Confirm</GenericButton>
        </div>
      </div>
    </GenericModal>
  );
};

export default CustomCourseModal;
