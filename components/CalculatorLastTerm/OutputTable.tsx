import React from "react";

interface Result {
  letter: string;
  score4: number;
  minScore: number | null;
  description: string;
}

interface OutputTableProps {
  results: Result[];
}

const OutputTable: React.FC<OutputTableProps> = ({ results }) => {
  const getRowStyles = (minScore: number | null) => {
    if (minScore === null) {
      return {
        backgroundColor: "rgba(31, 41, 55, 0.2)", // bg-gray-800/20
        transition: "background-color 0.3s ease",
      };
    }
    if (minScore > 10) {
      return {
        backgroundColor: "rgba(127, 29, 29, 0.2)", // bg-red-900/20
        transition: "background-color 0.3s ease",
      };
    }
    if (minScore <= 0) {
      return {
        backgroundColor: "rgba(20, 83, 45, 0.2)", // bg-green-900/20
        transition: "background-color 0.3s ease",
      };
    }
    return {
      backgroundColor: "rgba(22, 78, 99, 0.2)", // bg-cyan-900/20
      transition: "background-color 0.3s ease",
    };
  };

  const getRowHoverStyles = (minScore: number | null) => {
    if (minScore === null) {
      return "hover:bg-gray-800/30";
    }
    if (minScore > 10) {
      return "hover:bg-red-900/30";
    }
    if (minScore <= 0) {
      return "hover:bg-green-900/30";
    }
    return "hover:bg-cyan-900/30";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Your Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="border border-cyan-500/30 p-3">Grade</th>
              <th className="border border-cyan-500/30 p-3">4.0 Scale</th>
              <th className="border border-cyan-500/30 p-3">Min Final Score</th>
              <th className="border border-cyan-500/30 p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className={`transition-colors ${getRowHoverStyles(result.minScore)}`}
                style={getRowStyles(result.minScore)}
              >
                <td className="border border-cyan-500/30 p-3">
                  {result.letter}
                </td>
                <td className="border border-cyan-500/30 p-3">
                  {result.score4}
                </td>
                <td className="border border-cyan-500/30 p-3">
                  {result.minScore === null
                    ? ""
                    : result.minScore < 0
                      ? "0"
                      : result.minScore > 10
                        ? "> 10"
                        : result.minScore}
                </td>
                <td className="border border-cyan-500/30 p-3">
                  {result.minScore !== null ? result.description : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutputTable;
