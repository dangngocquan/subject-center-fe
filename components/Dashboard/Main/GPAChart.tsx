import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GPAChartProps {
  currentCPA: number;
}

const GPAChart: React.FC<GPAChartProps> = ({ currentCPA }) => {
  // Đảm bảo currentCPA hợp lệ, nếu không thì mặc định là 0
  const safeCPA =
    typeof currentCPA === "number" && currentCPA >= 0 && currentCPA <= 4
      ? currentCPA
      : 0;

  // Dữ liệu chính cho GPA hiện tại
  const data = [
    { name: "GPA", value: safeCPA },
    { name: "Remaining", value: 4 - safeCPA },
  ];

  // Dữ liệu cho các ngưỡng (1.0, 2.0, 3.0, 4.0)
  const thresholdData = [
    { name: "1.0", value: 1 },
    { name: "2.0", value: 1 },
    { name: "3.0", value: 1 },
    { name: "4.0", value: 1 },
  ];

  // Màu sắc cho các ngưỡng (từ thấp đến cao)
  const thresholdColors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"]; // Đỏ, Vàng, Xanh lá, Xanh dương

  // Mô tả mức độ GPA (dựa trên ngưỡng)
  const getGPALevelDescription = (gpa: number) => {
    if (gpa >= 3.6) return "Excellent";
    if (gpa >= 3.2) return "Very Good";
    if (gpa >= 2.5) return "Good";
    if (gpa >= 2.0) return "Ordinary";
    if (gpa >= 1.0) return "Poor";
    return "Below Minimum";
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
      <h3 className="text-cyan-400 text-2xl font-semibold mb-4">Current GPA</h3>
      <div className="flex items-center justify-center relative">
        {/* Biểu đồ */}
        <ResponsiveContainer height={250} width={250}>
          <PieChart>
            {/* Vòng ngoài: Các ngưỡng (1.0, 2.0, 3.0, 4.0) */}
            {thresholdData.map((_, index) => (
              <Pie
                key={`threshold-${index}`}
                data={[{ value: 4, name: "Threshold" }]}
                dataKey="value"
                endAngle={-270}
                fill="transparent"
                innerRadius={60 + index * 8} // Further increased size
                outerRadius={68 + index * 8} // Further increased size
                startAngle={90}
                stroke={thresholdColors[index]}
                strokeOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            {/* Vòng chính: GPA hiện tại */}
            <Pie
              data={data}
              dataKey="value"
              endAngle={-270}
              innerRadius={90} // Further increased size
              outerRadius={110} // Further increased size
              startAngle={90}
            >
              <Cell fill="#00ACC1" />
              <Cell fill="#4B5563" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Text ở giữa (dùng div để đảm bảo hiển thị) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white text-2xl font-semibold">
            {`${safeCPA.toFixed(1)}/4.0`}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {getGPALevelDescription(safeCPA)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAChart;
