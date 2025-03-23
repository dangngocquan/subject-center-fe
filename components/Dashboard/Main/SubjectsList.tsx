import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

import EditSubjectModal from "./EditSubjectModal";

import { updatePlanItem } from "@/service/plan.api";
import LoadingModal from "@/components/LoadingModal";
import ResultModal from "@/components/Dashboard/Main/ResultModal";
import { PlanItem } from "@/types/plan";

interface SubjectsListProps {
  items: PlanItem[];
}

const SubjectsList: React.FC<SubjectsListProps> = ({ items }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    message: string;
    isError: boolean;
  }>({ isOpen: false, message: "", isError: false });
  const [selectedSubject, setSelectedSubject] = useState<
    SubjectsListProps["items"][0] | null
  >(null);
  const [subjects, setSubjects] = useState<PlanItem[]>(items || []); // Ensure subjects are initialized

  // Update subjects when items prop changes
  useEffect(() => {
    setSubjects(items || []);
  }, [items]);

  const handleEditClick = (subject: SubjectsListProps["items"][0]) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (updatedSubject: PlanItem) => {
    setIsLoading(true);
    try {
      const result = await updatePlanItem(Number(selectedSubject?.planId), {
        id: Number(updatedSubject.id),
        name: updatedSubject.name,
        code: updatedSubject.code,
        credit: updatedSubject.credit,
        prerequisites: [], // Adjust prerequisites as needed
        gradeLatin: updatedSubject.gradeLatin,
      });
      if (!result.isBadRequest) {
        // Update the subjects list with the new data
        const updatedSubjects = subjects.map((subject) =>
          subject.id === updatedSubject.id
            ? { ...subject, ...updatedSubject }
            : subject
        );
        setSubjects(updatedSubjects);

        setResultModal({
          isOpen: true,
          message: "Subject updated successfully!",
          isError: false,
        });
      } else {
        if (result.status === 401) {
          setResultModal({
            isOpen: true,
            message: "Unauthorized. Please log in again.",
            isError: true,
          });
          // Optionally redirect to login page
          // window.location.href = "/login";
        } else {
          setResultModal({
            isOpen: true,
            message: `Failed to update subject: ${result.message}`,
            isError: true,
          });
        }
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      setResultModal({
        isOpen: true,
        message: "An error occurred while updating the subject.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
      <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Subjects</h3>
      {subjects.length > 0 ? ( // Check if subjects exist
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="py-2">Tên học phần</th>
              <th className="py-2">Mã</th>
              <th className="py-2">Tín chỉ</th>
              <th className="py-2">Điểm (4.0)</th>
              <th className="py-2">Điểm chữ</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b border-gray-800">
                <td className="py-3 text-white">{subject.name}</td>
                <td className="py-3 text-gray-300">{subject.code}</td>
                <td className="py-3 text-gray-300">{subject.credit}</td>
                <td className="py-3 text-gray-300">{subject.grade4 ?? "-"}</td>
                <td className="py-3 text-gray-300">
                  {subject.gradeLatin ?? "-"}
                </td>
                <td className="py-3 flex space-x-2">
                  <button
                    className="text-cyan-400 hover:text-cyan-300"
                    onClick={() => handleEditClick(subject)} // Open modal
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No subjects available.</p> // Show message if no subjects
      )}
      <button className="mt-4 bg-cyan-500 text-white rounded-full px-4 py-2 hover:bg-cyan-600 transition-all duration-300">
        Add Subject
      </button>
      {isModalOpen && selectedSubject && (
        <EditSubjectModal
          initialData={selectedSubject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      <LoadingModal isOpen={isLoading} />
      <ResultModal
        isError={resultModal.isError}
        isOpen={resultModal.isOpen}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, isOpen: false })}
      />
    </div>
  );
};

export default SubjectsList;
