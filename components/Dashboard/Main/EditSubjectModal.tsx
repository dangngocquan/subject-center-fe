import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import GenericModal from "../../Common/GenericModal";

import { PlanItem } from "@/types/plan";

// Định nghĩa enum EGradeLatin
export enum EGradeLatin {
  A_PLUS = "A+",
  A = "A",
  B_PLUS = "B+",
  B = "B",
  C_PLUS = "C+",
  C = "C",
  D_PLUS = "D+",
  D = "D",
  F = "F",
}

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedSubject: PlanItem) => void;
  initialData: PlanItem;
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.name?.trim() ||
      !formData.code?.trim() ||
      !String(formData.credit).trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (isNaN(Number(formData.credit))) {
      alert("Credit must be a valid number.");
      return;
    }
    onSubmit({
      id: formData.id,
      name: formData.name,
      code: formData.code,
      credit: formData.credit,
      gradeLatin: formData.gradeLatin || "",
    });
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold text-white mb-4">Edit Subject</h3>
      <input
        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        name="code"
        placeholder="Code"
        value={formData.code}
        onChange={handleChange}
      />
      <input
        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        name="credit"
        placeholder="Credit"
        value={formData.credit}
        onChange={handleChange}
      />
      {/* Thay input thành select cho gradeLatin */}
      <select
        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        name="gradeLatin"
        value={formData.gradeLatin || ""}
        onChange={handleChange}
      >
        <option value="">Select Grade (Latin)</option>
        {Object.values(EGradeLatin).map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2">
        <motion.button
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Cancel
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-all duration-200 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
        >
          Submit
        </motion.button>
      </div>
    </GenericModal>
  );
};

export default EditSubjectModal;
