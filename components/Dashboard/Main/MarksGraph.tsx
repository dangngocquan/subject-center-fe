import { Mark } from "@/types/plan";
import React, { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MarksGraphProps {
  cpa:
    | {
        withoutImprovements: { marks: Mark[] };
        withImprovements: { marks: Mark[] };
      }
    | undefined;
}

interface CustomTooltipProps {
  active?: any;
  payload?: any;
  label?: any;
}

const scaleCoefficient = 100;

const MarksGraph: React.FC<MarksGraphProps> = ({ cpa }) => {
  const [useImprovements, setUseImprovements] = useState(false);

  const splitMarks = Array.from({ length: 401 }, (_, i) => ({
    grade4: i,
    details: {
      content:
        "Good (2.5 - 3.19) - Solid performance with some areas of improvement",
    },
  }));

  const marks = useImprovements
    ? (cpa?.withImprovements.marks ?? [])
    : (cpa?.withoutImprovements.marks ?? []);

  const graduationMarks = marks.filter(
    (mark) => mark.type === "GRADUATION_MARK"
  );
  const minMark = marks.find((mark) => mark.type === "MIN");
  const maxMark = marks.find((mark) => mark.type === "MAX");
  const currentMark = marks.find((mark) => mark.type === "CURRENT");

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active) {
      const x = (payload[0]?.payload?.grade4 || 0) / scaleCoefficient;
      const graduations = graduationMarks.filter((e) => x >= e.grade4);
      return (
        <div className="tooltip bg-gray-500 p-4 rounded-lg shadow-lg">
          <h4>{graduations[graduations.length - 1].details.content}</h4>
          <p>{x}</p>
        </div>
      );
    }
    return null;
  };

  const areaRanges = [
    {
      start: minMark?.grade4 || 0,
      end: maxMark?.grade4 || 0,
      value: 3,
      color: "#34D399",
    },
  ];
  const areaData = areaRanges.map((range) => {
    const data = [];
    for (
      let i = range.start * scaleCoefficient;
      i <= range.end * scaleCoefficient;
      i++
    ) {
      data.push({ grade4: i, value: range.value });
    }
    return { data, color: range.color };
  });

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
      <h3 className="text-cyan-400 text-2xl font-semibold mb-4">CPA Marks</h3>
      <div className="flex items-center mb-4">
        <input
          checked={useImprovements}
          className="mr-2"
          id="improvement"
          type="checkbox"
          onChange={(e) => setUseImprovements(e.target.checked)}
        />
        <label className="text-cyan-400" htmlFor="improvement">
          Improvement
        </label>
      </div>
      <ResponsiveContainer height={300} width="100%">
        <ComposedChart
          data={splitMarks}
          margin={{ top: 50, bottom: 100, right: 30, left: 30 }}
        >
          <CartesianGrid stroke="#4B5563" strokeDasharray="3 3" />
          <XAxis
            dataKey="grade4"
            domain={splitMarks.map((m) => m.grade4)}
            fontSize={12}
            scale={"linear"}
            stroke="#94A3B8"
            tickFormatter={(value) => (value / scaleCoefficient).toFixed(2)}
            ticks={marks.map((m) => m.grade4 * scaleCoefficient)}
          />
          <YAxis hide domain={[0, 3]} />

          {/* Hiển thị nhiều vùng Area */}
          {areaData.map((area, index) => (
            <Area
              key={`area-${index}`}
              data={area.data}
              dataKey="value"
              fill={area.color}
              fillOpacity={0.1}
              stroke="transparent"
            />
          ))}
          {/* Các mốc GRADUATION_MARK */}
          {graduationMarks.map((mark) => (
            <ReferenceLine
              key={`graduation-${mark.grade4}`}
              stroke="#3B82F6"
              strokeDasharray="5 5"
              strokeWidth={2}
              x={mark.grade4 * scaleCoefficient}
            />
          ))}
          {/* Mốc MIN */}
          {minMark && (
            <ReferenceLine
              stroke="#EF4444"
              strokeWidth={2}
              x={minMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-40} // Đẩy nhãn xuống 20px từ vị trí mặc định
                position="insideBottom"
                value={`MIN`}
              />
            </ReferenceLine>
          )}
          {/* Mốc CURRENT */}
          {currentMark && (
            <ReferenceLine
              stroke="green"
              strokeWidth={2}
              x={currentMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="green"
                fontSize={12}
                offset={-40} // Đẩy nhãn xuống 20px từ vị trí mặc định
                position="insideBottom"
                value={`CURRENT`}
              />
            </ReferenceLine>
          )}
          {/* Mốc MAX */}
          {maxMark && (
            <ReferenceLine
              stroke="#EF4444"
              strokeWidth={2}
              x={maxMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-40} // Đẩy nhãn xuống 20px từ vị trí mặc định
                position="insideBottom"
                value={`MAX`}
              />
            </ReferenceLine>
          )}

          <Tooltip content={<CustomTooltip />} />
        </ComposedChart>
      </ResponsiveContainer>
      {/* Bảng phía dưới biểu đồ */}
      <div className="mt-4">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Graduation Mark</th>
              <th className="py-2 px-4">Can Achieve</th>
            </tr>
          </thead>
          <tbody>
            {graduationMarks.map((mark, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="py-2 px-4">{mark.details.content}</td>
                <td className="py-2 px-4">
                  {mark.grade4 >= (minMark?.grade4 || 0) &&
                  mark.grade4 <= (maxMark?.grade4 || 0)
                    ? "Yes"
                    : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksGraph;
