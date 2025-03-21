import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface SubjectsListProps {
  subjects: {
    id: string;
    name: string;
    code: string;
    credit: string;
    grade4: number | null;
    gradeLatin: string | null;
  }[];
}

const SubjectsList: React.FC<SubjectsListProps> = ({ subjects }) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
      <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Subjects</h3>
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
                <button className="text-cyan-400 hover:text-cyan-300">
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
      <button className="mt-4 bg-cyan-500 text-white rounded-full px-4 py-2 hover:bg-cyan-600 transition-all duration-300">
        Add Subject
      </button>
    </div>
  );
};

export default SubjectsList;
