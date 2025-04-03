// components/TimeTable/TimeTableInput/CustomCourseModal.tsx
"use client";

import React, { useState, useRef } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

import { CourseItem } from "../types";

import GenericModal from "@/components/Common/GenericModal";
import { GenericButton } from "@/components/Common/GenericButton";

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
      newErrors.courseCode = "Mã học phần không được để trống.";
      isValid = false;
    }
    if (!form.courseName.trim()) {
      newErrors.courseName = "Tên học phần không được để trống.";
      isValid = false;
    }
    if (!form.classCode.trim()) {
      newErrors.classCode = "Mã lớp học phần không được để trống.";
      isValid = false;
    }
    if (
      form.period.length === 0 ||
      form.period.some((p) => isNaN(p) || p < 1)
    ) {
      newErrors.period = "Tiết học phải là số dương và không được để trống.";
      isValid = false;
    }
    if (!form.credits.trim() || isNaN(Number(form.credits))) {
      newErrors.credits = "Số tín chỉ phải là một số hợp lệ.";
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
      <div className="text-center text-white font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Thêm Course Tùy Chỉnh
        </h3>
        <div className="space-y-4 text-left">
          <div>
            <input
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
              placeholder="Mã học phần"
              type="text"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            />
            {errors.courseCode && (
              <p className="text-red-400 text-sm mt-1">{errors.courseCode}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
              placeholder="Tên học phần"
              type="text"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            />
            {errors.courseName && (
              <p className="text-red-400 text-sm mt-1">{errors.courseName}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
              placeholder="Mã lớp học phần"
              type="text"
              value={form.classCode}
              onChange={(e) => setForm({ ...form, classCode: e.target.value })}
            />
            {errors.classCode && (
              <p className="text-red-400 text-sm mt-1">{errors.classCode}</p>
            )}
          </div>
          <div>
            <select
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm({ ...form, dayOfWeek: parseInt(e.target.value) })
              }
            >
              <option value={0}>Thứ Hai</option>
              <option value={1}>Thứ Ba</option>
              <option value={2}>Thứ Tư</option>
              <option value={3}>Thứ Năm</option>
              <option value={4}>Thứ Sáu</option>
              <option value={5}>Thứ Bảy</option>
              <option value={6}>Chủ Nhật</option>
            </select>
          </div>
          <div>
            <div className="relative w-full bg-gray-800 border border-gray-700 rounded-lg p-2 min-h-[40px] flex flex-wrap items-center gap-2">
              {form.period.map((period, index) => (
                <div
                  key={index}
                  className="bg-gray-600 text-white rounded-full px-2 py-1 text-sm flex items-center"
                >
                  {period}
                  <button
                    className="ml-1 text-gray-300 hover:text-red-400"
                    onClick={() => removePeriod(index)}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  className="bg-transparent text-gray-300 border-none outline-none w-16"
                  min="1"
                  placeholder="Tiết"
                  type="number"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <GenericButton
                  className="text-sm hover:bg-green-500 hover:text-white"
                  onClick={addPeriod}
                >
                  <FaPlus size={12} />
                </GenericButton>
              </div>
            </div>
            {errors.period && (
              <p className="text-red-400 text-sm mt-1">{errors.period}</p>
            )}
          </div>
          <div>
            <input
              className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2"
              placeholder="Số tín chỉ"
              type="text"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: e.target.value })}
            />
            {errors.credits && (
              <p className="text-red-400 text-sm mt-1">{errors.credits}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <GenericButton onClick={onClose}>Hủy</GenericButton>
          <GenericButton onClick={handleSubmit}>Xác nhận</GenericButton>
        </div>
      </div>
    </GenericModal>
  );
};

export default CustomCourseModal;
