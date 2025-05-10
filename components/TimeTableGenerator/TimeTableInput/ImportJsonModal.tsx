// components/TimeTable/TimeTableInput/ImportJsonModal.tsx
"use client";

import React, { useState } from "react";

import { CourseItem } from "../types";

import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";

interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courses: CourseItem[]) => void; // Trả về CourseItem[], sẽ được thêm selected trong TimeTableInput
}

const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setJsonFile(file);
    } else {
      alert("Vui lòng chọn file JSON hợp lệ!");
    }
  };

  const handleSubmit = () => {
    if (!jsonFile) {
      alert("Vui lòng chọn file JSON trước!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.items && Array.isArray(parsed.items)) {
          onSubmit(parsed.items);
          setJsonFile(null);
        } else {
          alert("File JSON không đúng định dạng!");
        }
      } catch (error) {
        alert("File JSON không hợp lệ!");
      }
    };
    reader.readAsText(jsonFile);
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center text-color-15 font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Import Course từ File JSON
        </h3>
        <p className="text-color-15 mb-4">Chọn file JSON theo định dạng sau:</p>
        <pre className="border border-color-15 bg-color-1 text-color-15 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap overflow-x-auto text-sm">
          {`{
  "items": [
    {
      "courseCode": "MAT3422",
      "courseName": "Lý thuyết bản và vỏ mỏng",
      "classCode": "MAT3422",
      "dayOfWeek": 1,
      "period": [1, 2, 3],
      "credits": 4
    }
  ]
}`}
        </pre>
        <div className="mb-6">
          <label className="inline-block bg-color-1 text-color-15 rounded-full px-4 py-2 cursor-pointer hover:bg-color-6 transition-all duration-300 border border-color-15">
            Chọn File JSON
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {jsonFile && (
            <p className="text-color-15 mt-2">Đã chọn: {jsonFile.name}</p>
          )}
        </div>
        <div className="flex w-full justify-between">
          <GenericButton onClick={onClose} className="hover:bg-color-R6 l-0">
            Hủy
          </GenericButton>
          <GenericButton onClick={handleSubmit} className="mr-0">Xác nhận</GenericButton>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportJsonModal;
