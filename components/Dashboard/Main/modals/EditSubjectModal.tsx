import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";

import GenericModal from "../../../Common/GenericModal";

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
  const [formData, setFormData] = useState<PlanItem>(initialData);
  const [newPrerequisite, setNewPrerequisite] = useState<string>("");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "credit" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handlePrerequisiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrerequisite(e.target.value);
  };

  const addPrerequisite = (value: string) => {
    if (value.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), value.trim()],
    }));
    setNewPrerequisite("");
  };

  const removePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: (prev.prerequisites || []).filter((_, i) => i !== index),
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    const updatedPrerequisites = [...(formData.prerequisites || [])];
    updatedPrerequisites[index] = value;
    setFormData((prev) => ({ ...prev, prerequisites: updatedPrerequisites }));
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
    if (isNaN(Number(formData?.credit)) || Number(formData.credit) <= 0) {
      alert("Credit must be a valid positive number.");
      return;
    }
    onSubmit({
      id: formData.id,
      name: formData.name,
      code: formData.code,
      credit: Number(formData.credit),
      gradeLatin: formData.gradeLatin || null,
      prerequisites: formData.prerequisites || [],
    });
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-color-15 font-sans p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Edit Subject
        </h3>
        <div className="mb-6">
          <label
            className="text-color-15 font-semibold mb-3 block"
            htmlFor="name-input"
          >
            Name *
          </label>
          <input
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 shadow-inner text-sm sm:text-base"
            id="name-input"
            name="name"
            placeholder="Subject Name *"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="text-color-15 font-semibold mb-3 block"
            htmlFor="code-input"
          >
            Code *
          </label>
          <input
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 shadow-inner text-sm sm:text-base"
            id="code-input"
            name="code"
            placeholder="Code *"
            value={formData.code || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="text-color-15 font-semibold mb-3 block"
            htmlFor="credit-input"
          >
            Credit *
          </label>
          <input
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 shadow-inner text-sm sm:text-base"
            id="credit-input"
            name="credit"
            placeholder="Credit *"
            value={formData.credit === 0 ? "" : formData.credit || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="text-color-15 font-semibold mb-3 block"
            htmlFor="gradeLatin-select"
          >
            Grade
          </label>
          <select
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 shadow-inner text-sm sm:text-base"
            id="gradeLatin-select"
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
        </div>
        <div className="mb-6">
          <label
            className="text-color-15 font-semibold mb-3 block"
            htmlFor="prerequisites-input"
          >
            Prerequisites
          </label>
          <div className="space-y-3">
            {formData.prerequisites && formData.prerequisites.length > 0 && (
              <>
                {formData.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <input
                      className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 text-sm sm:text-base"
                      value={prereq}
                      onChange={(e) =>
                        updatePrerequisite(index, e.target.value)
                      }
                    />
                    <button
                      className="text-color-15 hover:text-color-R7 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      onClick={() => removePrerequisite(index)}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </>
            )}
            <div className="flex items-center gap-2">
              <input
                className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 text-sm sm:text-base"
                id="prerequisites-input"
                placeholder="Add prerequisite"
                value={newPrerequisite}
                onChange={handlePrerequisiteChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    addPrerequisite(e.currentTarget.value);
                    e.currentTarget.value = ""; // Clear input on Enter
                  }
                }}
              />
              <button
                className="text-color-15 hover:text-color-15 transition-colors duration-200"
                onClick={() => {
                  const input = document.getElementById(
                    "prerequisites-input",
                  ) as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addPrerequisite(input.value);
                    input.value = ""; // Clear input on click
                  }
                }}
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:from-color-6 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <motion.button
            className="w-full bg-gradient-to-r from-color-G3 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-G6 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base"
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 1 }}
            onClick={handleSubmit}
          >
            Submit
          </motion.button>
        </div>
      </div>
    </GenericModal>
  );
};

export default EditSubjectModal;
