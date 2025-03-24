import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GPAChartProps {
  currentCPA: number;
}

const GPAChart: React.FC<GPAChartProps> = ({ currentCPA }) => {
  const safeCPA =
    typeof currentCPA === "number" && currentCPA >= 0 && currentCPA <= 4
      ? currentCPA
      : 0;

  const data = [
    { name: "GPA", value: safeCPA },
    { name: "Remaining", value: 4 - safeCPA },
  ];

  const thresholdData = [
    { name: "1.0", value: 1 },
    { name: "2.0", value: 1 },
    { name: "3.0", value: 1 },
    { name: "4.0", value: 1 },
  ];

  const thresholdColors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"];

  const getGPALevelDescription = (gpa: number) => {
    if (gpa >= 3.6) return "Excellent";
    if (gpa >= 3.2) return "Very Good";
    if (gpa >= 2.5) return "Good";
    if (gpa >= 2.0) return "Ordinary";
    if (gpa >= 1.0) return "Poor";
    return "Below Minimum";
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg shadow-cyan-500/20 h-full flex flex-col">
      <h3 className="text-cyan-400 text-xl sm:text-2xl font-semibold mb-4">
        Current GPA
      </h3>
      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {thresholdData.map((_, index) => (
              <Pie
                key={`threshold-${index}`}
                data={[{ value: 4, name: "Threshold" }]}
                dataKey="value"
                endAngle={-270}
                fill="transparent"
                innerRadius={50 + index * 8}
                outerRadius={58 + index * 8}
                startAngle={90}
                stroke={thresholdColors[index]}
                strokeOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Pie
              data={data}
              dataKey="value"
              endAngle={-270}
              innerRadius={80}
              outerRadius={100}
              startAngle={90}
            >
              <Cell fill="#00ACC1" />
              <Cell fill="#4B5563" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white text-lg sm:text-2xl font-semibold">
            {`${safeCPA.toFixed(2)}/4.0`}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-1">
            {getGPALevelDescription(safeCPA)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAChart;
