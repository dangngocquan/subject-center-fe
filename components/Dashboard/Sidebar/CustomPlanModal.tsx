import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";

import GenericModal from "@/components/Common/GenericModal";
import { createNewPlan } from "@/service/plan.api";
import { Plan, PlanResultUpsert } from "@/types/plan";
import { siteConfig } from "@/config/site";

interface Subject {
  name: string;
  code: string;
  credit: number;
  prerequisites: string[];
  gradeLatin?: string;
}

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Plan) => void;
}

const CustomPlanModal: React.FC<CustomPlanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [planName, setPlanName] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    message: string;
    isSuccess: boolean;
    data?: PlanResultUpsert;
  }>({
    isOpen: false,
    message: "",
    isSuccess: false,
    data: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { name: "", code: "", credit: 0, prerequisites: [] },
    ]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof Subject, value: any) => {
    const updatedSubjects = [...subjects];
    if (field === "credit") {
      updatedSubjects[index][field] = value === "" ? 0 : parseInt(value) || 0;
    } else {
      updatedSubjects[index][field] = value;
    }
    setSubjects(updatedSubjects);
  };

  const addPrerequisite = (subjectIndex: number, prerequisite: string) => {
    if (prerequisite.trim()) {
      const updatedSubjects = [...subjects];
      updatedSubjects[subjectIndex].prerequisites.push(prerequisite.trim());
      setSubjects(updatedSubjects);
    }
  };

  const removePrerequisite = (subjectIndex: number, prereqIndex: number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].prerequisites = updatedSubjects[
      subjectIndex
    ].prerequisites.filter((_, i) => i !== prereqIndex);
    setSubjects(updatedSubjects);
  };

  const validateData = (): string | null => {
    if (!planName.trim()) return "Plan name is required.";
    if (subjects.length === 0) return "At least one subject is required.";
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      if (!subject.name.trim()) return `Subject ${i + 1}: Name is required.`;
      if (!subject.code.trim()) return `Subject ${i + 1}: Code is required.`;
      if (
        isNaN(subject.credit) ||
        subject.credit <= 0 ||
        !Number.isInteger(subject.credit)
      ) {
        return `Subject ${i + 1}: Credit must be a positive integer.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateData();
    if (error) {
      setErrorModal({ isOpen: true, message: error });
      return;
    }

    setIsLoading(true);
    try {
      const planData: Plan = {
        name: planName,
        items: subjects.map((subject) => ({
          name: subject.name,
          code: subject.code,
          credit: subject.credit,
          prerequisites: subject.prerequisites,
        })),
      };

      const response = await createNewPlan(planData);

      setIsLoading(false);

      if (!response.isBadRequest) {
        setResultModal({
          isOpen: true,
          message: response.message || "Plan created successfully!",
          isSuccess: true,
          data: response.data,
        });
        onSubmit({ ...planData, id: response.data?.plan?.id }); // Truyền plan với id từ API
        setPlanName("");
        setSubjects([]);
        onClose();
      } else {
        setResultModal({
          isOpen: true,
          message: response.message || "Failed to create plan.",
          isSuccess: false,
        });
      }
    } catch (error) {
      setIsLoading(false);
      setResultModal({
        isOpen: true,
        message:
          error instanceof Error ? error.message : "Failed to create plan.",
        isSuccess: false,
      });
    }
  };

  return (
    <>
      <GenericModal isOpen={isOpen} onClose={onClose}>
        <div className="text-color-15 font-sans p-4 sm:p-6">
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
            Customize By Form Data
          </h2>
          <input
            className="w-full bg-gradient-to-r from-color-3 to-color-1 text-color-15 rounded-lg px-4 py-3 mb-6 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-R7 shadow-inner text-sm sm:text-base"
            disabled={isLoading}
            placeholder="Plan Name *"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
          <div className="max-h-80 overflow-y-auto mb-6 shadow-lg shadow-color-15/50">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-color-6 text-color-15 sticky top-0">
                  <th className="border border-color-15 p-3 sm:p-4 text-left font-semibold">
                    Name *
                  </th>
                  <th className="border border-color-15 p-3 sm:p-4 text-left font-semibold">
                    Code *
                  </th>
                  <th className="border border-color-15 p-3 sm:p-4 text-left font-semibold">
                    Credit *
                  </th>
                  <th className="border border-color-15 p-3 sm:p-4 text-left font-semibold">
                    Prerequisites
                  </th>
                  <th className="border border-color-15 p-3 sm:p-4 text-left font-semibold">
                    Grade
                  </th>
                  <th className="border border-color-15 p-3 sm:p-4" />
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr
                    key={index}
                    className="hover:bg-color-4 transition-colors duration-200"
                  >
                    <td className="border border-color-15 p-3 sm:p-4">
                      <input
                        className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 text-sm sm:text-base placeholder-color-R7"
                        disabled={isLoading}
                        placeholder="Name *"
                        value={subject.name}
                        onChange={(e) =>
                          updateSubject(index, "name", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-color-15 p-3 sm:p-4">
                      <input
                        className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 text-sm sm:text-base placeholder-color-R7"
                        disabled={isLoading}
                        placeholder="Code *"
                        value={subject.code}
                        onChange={(e) =>
                          updateSubject(index, "code", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-color-15 p-3 sm:p-4">
                      <input
                        className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 text-sm sm:text-base placeholder-color-R7"
                        disabled={isLoading}
                        placeholder="Credit *"
                        type="text"
                        value={subject.credit === 0 ? "" : subject.credit}
                        onChange={(e) =>
                          updateSubject(index, "credit", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-color-15 p-3 sm:p-4">
                      <div className="space-y-3">
                        {subject.prerequisites.map((prereq, prereqIndex) => (
                          <div
                            key={prereqIndex}
                            className="flex items-center gap-2 group"
                          >
                            <input
                              className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 text-sm sm:text-base placeholder-color-15"
                              disabled={isLoading}
                              value={prereq}
                              onChange={(e) => {
                                const updatedSubjects = [...subjects];
                                updatedSubjects[index].prerequisites[
                                  prereqIndex
                                ] = e.target.value;
                                setSubjects(updatedSubjects);
                              }}
                            />
                            <button
                              className="text-color-15 hover:text-color-R7 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              disabled={isLoading}
                              onClick={() =>
                                removePrerequisite(index, prereqIndex)
                              }
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 placeholder-color-15 text-sm sm:text-base"
                            disabled={isLoading}
                            placeholder="Add prerequisite"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addPrerequisite(index, e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <button
                            className="text-color-15 hover:text-color-G7 transition-colors duration-200"
                            disabled={isLoading}
                            onClick={() => {
                              const input = document.querySelector(
                                `tr:nth-child(${index + 1}) input[placeholder="Add prerequisite"]`
                              ) as HTMLInputElement;
                              addPrerequisite(index, input.value);
                              input.value = "";
                            }}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="border border-color-15 p-3 sm:p-4">
                      <input
                        className="w-full bg-color-1 text-color-15 rounded-lg px-3 py-2 border border-color-15 focus:outline-none focus:ring-1 focus:ring-color-15 transition-all duration-300 text-sm sm:text-base placeholder-color-15"
                        disabled={isLoading}
                        placeholder="Grade"
                        value={subject.gradeLatin || ""}
                        onChange={(e) =>
                          updateSubject(index, "gradeLatin", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-color-15 p-3 sm:p-4">
                      <button
                        className="text-color-15 hover:text-color-R7 transition-colors duration-200"
                        disabled={isLoading}
                        onClick={() => removeSubject(index)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-[-16px] w-full bg-color-1 border border-color-15 hover:bg-color-6 text-color-15 px-4 py-3 flex items-center justify-center gap-2 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md text-sm sm:text-base"
            disabled={isLoading}
            onClick={addSubject}
          >
            <FaPlus /> Add Subject
          </button>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              className="w-full bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-3 hover:from-color-9 hover:to-color-1 transition-all duration-300 shadow-lg hover:shadow-color-15/50 text-sm sm:text-base disabled:opacity-50"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </GenericModal>

      {/* <GenericModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
      >
        <div className="text-white p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600">
            Error
          </h2>
          <p className="mb-6 text-sm sm:text-base">{errorModal.message}</p>
          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-color-15 rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg text-sm sm:text-base"
            onClick={() => setErrorModal({ isOpen: false, message: "" })}
          >
            OK
          </button>
        </div>
      </GenericModal> */}

      <GenericModal
        isOpen={resultModal.isOpen}
        onClose={() =>
          setResultModal({ isOpen: false, message: "", isSuccess: false })
        }
      >
        <div className="text-white p-4 sm:p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-G7 to-color-1">
            {resultModal.isSuccess ? "Success" : "Error"}
          </h2>
          <p className="mb-6 text-sm sm:text-base text-center">
            {resultModal.message}
          </p>
          <Link
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-color-15 rounded-lg px-4 py-3 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg text-sm sm:text-base text-center"
            href={`${siteConfig.routers.planDetails(String(resultModal.data?.plan?.id))}`}
          >
            OK
          </Link>
        </div>
      </GenericModal>
    </>
  );
};

export default CustomPlanModal;
