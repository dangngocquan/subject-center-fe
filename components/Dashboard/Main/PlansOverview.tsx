import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PlansOverviewProps {
  plans: { id: string; name: string; createdAt: string }[];
  selectedPlan: { id: string; name: string } | null;
}

const slideInVariants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -100 : 100,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
  }),
};

const PlansOverview: React.FC<PlansOverviewProps> = ({
  plans,
  selectedPlan,
}) => {
  // Gom nhóm Plans theo ngày
  const groupPlansByDate = () => {
    const dateMap = new Map<string, number>();
    plans.forEach((plan) => {
      const date = new Date(plan.createdAt).toLocaleDateString();
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    // Chuyển đổi Map thành mảng cho biểu đồ
    const chartData = Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
      cumulativeCount: Array.from(dateMap.entries())
        .filter(([d]) => new Date(d) <= new Date(date))
        .reduce((sum, [, c]) => sum + c, 0),
    }));

    return chartData;
  };

  const chartData = groupPlansByDate();

  return (
    <motion.div
      animate="visible"
      className="flex flex-1 items-center justify-center p-8"
      custom="left"
      initial="hidden"
      variants={slideInVariants}
    >
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20 w-full max-w-4xl">
        <h3 className="text-cyan-400 text-2xl font-semibold mb-4">
          Plans Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Total Plans</p>
            <p className="text-white text-2xl font-semibold">{plans.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Selected Plan</p>
            <p className="text-white text-2xl font-semibold">
              {selectedPlan ? selectedPlan.name : "None"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-cyan-300 text-xl font-medium mb-2">
            Plans Creation Timeline
          </h4>
          <ResponsiveContainer height={200} width="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#4B5563" strokeDasharray="3 3" />
              <XAxis
                angle={-45}
                dataKey="date"
                height={60}
                stroke="#94A3B8"
                textAnchor="end"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "none",
                  color: "#FFFFFF",
                }}
                formatter={(value: number) => [value, "Plans"]}
              />
              <Legend />
              <Line
                activeDot={{ r: 8 }}
                dataKey="count"
                name="New Plans"
                stroke="#00ACC1"
                type="monotone"
              />
              <Line
                activeDot={{ r: 8 }}
                dataKey="cumulativeCount"
                name="Cumulative Plans"
                stroke="#F59E0B" // Màu vàng để phân biệt
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default PlansOverview;
