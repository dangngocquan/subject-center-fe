import React from "react";

interface StatsSectionProps {
  totalSubjects: number;
  totalCredits: number;
  totalSubjectsCompleted: number;
  totalCreditsCompleted: number;
  totalSubjectsIncomplete: number;
  totalCreditsIncomplete: number;
  totalSubjectsCanImprovement: number;
  totalCreditsCanImprovement: number;
  currentCPA: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  totalSubjects,
  totalCredits,
  totalSubjectsCompleted,
  totalCreditsCompleted,
  totalSubjectsIncomplete,
  totalCreditsIncomplete,
  totalSubjectsCanImprovement,
  totalCreditsCanImprovement,
  currentCPA,
}) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 shadow-lg shadow-cyan-500/20 h-full flex flex-col">
      <h3 className="text-cyan-400 text-xl font-semibold mb-4">Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs uppercase font-medium">
            Overview
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-white text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalSubjects || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Subjects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-white text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalCredits || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Credits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
          <p className="text-gray-400 text-xs uppercase font-medium">
            Completed
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-green-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalSubjectsCompleted || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Subjects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-green-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalCreditsCompleted || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Credits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-red-500">
          <p className="text-gray-400 text-xs uppercase font-medium">
            Incomplete
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-red-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalSubjectsIncomplete || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Subjects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-red-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalCreditsIncomplete || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Credits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-yellow-500">
          <p className="text-gray-400 text-xs uppercase font-medium">
            Can Improve
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center">
              <p
                className="text-yellow-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalSubjectsCanImprovement || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Subjects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p
                className="text-yellow-400 text-lg font-semibold"
                style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
              >
                {totalCreditsCanImprovement || 0}
              </p>
              <p
                className="text-gray-400 text-xs"
                style={{ fontSize: "clamp(10px, 1.5vw, 12px)" }}
              >
                Credits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 sm:col-span-2">
          <p className="text-gray-400 text-xs uppercase font-medium">
            Current CPA
          </p>
          <p
            className="text-cyan-400 text-lg font-semibold text-center mt-2"
            style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
          >
            {currentCPA ? currentCPA.toFixed(4) : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
