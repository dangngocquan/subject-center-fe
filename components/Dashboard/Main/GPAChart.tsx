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
    <div className="bg-color-1 rounded-2xl p-4 sm:p-6 shadow-lg shadow-color-15/50 h-full flex flex-col z-10">
      <h3 className="text-color-15 text-xl sm:text-2xl font-semibold mb-4">
        Current GPA
      </h3>
      <div className="flex-1 flex items-center justify-center relative z-1">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            {thresholdData.map((_, index) => (
              <Pie
                key={`threshold-${index}`}
                className="z-0"
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
              z={1}
            >
              <Cell fill="#00ACC1" />
              <Cell fill="#4B5563" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="z-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-color-15 text-lg sm:text-2xl font-semibold z-1">
            {`${safeCPA.toFixed(2)}/4.0`}
          </div>
          <div className="text-color-15 text-xs sm:text-sm mt-1 z-1">
            {getGPALevelDescription(safeCPA)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAChart;
