import React from "react";

interface StatsSectionProps {
  totalSubjects: number;
  totalCredits: number;
  totalSubjectsCompleted: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  totalSubjects,
  totalCredits,
  totalSubjectsCompleted,
}) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20 mt-3">
      <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Statistics</h3>
      {/* Ensure grid and grid-cols-1 are applied */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400">Total Subjects</p>
          <p className="text-white text-xl font-semibold">
            {totalSubjects || 0}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400">Total Credits</p>
          <p className="text-white text-xl font-semibold">
            {totalCredits || 0}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400">Subjects Completed</p>
          <p className="text-white text-xl font-semibold">
            {totalSubjectsCompleted || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
