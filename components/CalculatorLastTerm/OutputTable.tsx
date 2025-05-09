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
  // const getRowStyles = (minScore: number | null) => {
  //   if (minScore === null) {
  //     return {
  //       backgroundColor: "bg-color-6", // bg-gray-800/20
  //       // transition: "background-color 0.3s ease",
  //     };
  //   }
  //   if (minScore > 10) {
  //     return {
  //       backgroundColor: "bg-color-R15)", // bg-red-900/20
  //       // transition: "background-color 0.3s ease",
  //     };
  //   }
  //   if (minScore <= 0) {
  //     return {
  //       backgroundColor: "bg-color-G15", // bg-green-900/20
  //       // transition: "background-color 0.3s ease",
  //     };
  //   }
  //   return {
  //     backgroundColor: "bg-color-B15", // bg-cyan-900/20
  //     // transition: "background-color 0.3s ease",
  //   };
  // };

  const getRowStyles = (minScore: number | null) => {
    if (minScore === null) {
      return "bg-color-3";
    }
    if (minScore > 10) {
      return "bg-color-R3";
    }
    if (minScore <= 0) {
      return "bg-color-G3";
    }
    return "bg-color-B3";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-color-15">Your Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-color-15">
          <thead>
            <tr className="bg-color-1">
              <th className="border border-color-15 p-3">Grade</th>
              <th className="border border-color-15 p-3">4.0 Scale</th>
              <th className="border border-color-15 p-3">Min Final Score</th>
              <th className="border border-color-15 p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className={`${getRowStyles(result.minScore)}`}
                // style={getRowStyles(result.minScore)}
              >
                <td className="border border-color-15 p-3">{result.letter}</td>
                <td className="border border-color-15 p-3">{result.score4}</td>
                <td className="border border-color-15 p-3">
                  {result.minScore === null
                    ? ""
                    : result.minScore < 0
                      ? "0"
                      : result.minScore > 10
                        ? "> 10"
                        : result.minScore}
                </td>
                <td className="border border-color-15 p-3">
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
