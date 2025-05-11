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

import { Mark } from "@/types/plan";

interface MarksGraphProps {
  cpa:
    | {
        withoutImprovements: { marks: Mark[] };
        withImprovements: { marks: Mark[] };
      }
    | undefined;
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
    (mark) => mark.type === "GRADUATION_MARK" || mark.type === "NODE"
  );
  const minMark = marks.find((mark) => mark.type === "MIN");
  const maxMark = marks.find((mark) => mark.type === "MAX");
  const currentMark = marks.find((mark) => mark.type === "CURRENT");

  const CustomTooltip: React.FC<{ active?: any; payload?: any }> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const x = payload[0].payload.grade4 / scaleCoefficient;
      const graduations = graduationMarks.filter((e) => x >= e.grade4);
      if (x < (minMark?.grade4 ?? 5) || x > (maxMark?.grade4 ?? -1)) {
        return null;
      }
      return (
        <div className="bg-gray-500 p-4 rounded-lg shadow-lg text-white">
          <h4>{graduations[graduations.length - 1]?.details?.content}</h4>
          <p>{x.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const area = {
    data: Array.from({ length: 401 }, (_, i) => ({
      grade4: i,
      value:
        i >= (minMark?.grade4 ?? 0) * scaleCoefficient &&
        i <= (maxMark?.grade4 ?? 4) * scaleCoefficient
          ? 3
          : 0,
    })),
    color: "#34D399",
  };

  return (
    <div className="bg-color-1 rounded-2xl p-4 sm:p-6 shadow-lg shadow-color-15/50">
      <h3 className="text-color-15 text-xl sm:text-2xl font-semibold mb-4">
        CPA Marks
      </h3>
      <div className="flex items-center mb-4">
        <input
          checked={useImprovements}
          className="mr-2"
          id="improvement"
          type="checkbox"
          onChange={(e) => setUseImprovements(e.target.checked)}
        />
        <label className="text-color-15" htmlFor="improvement">
          Include Improvements
        </label>
      </div>
      <ResponsiveContainer height={230} width="100%">
        <ComposedChart
          data={splitMarks}
          margin={{ top: 50, bottom: 20, right: 30, left: 30 }}
        >
          <CartesianGrid stroke="#4B5563" strokeDasharray="3 3" />
          <XAxis
            dataKey="grade4"
            domain={[0, 400]}
            fontSize={12}
            scale="linear"
            stroke="#94A3B8"
            tickFormatter={(value) => (value / scaleCoefficient).toFixed(2)}
            ticks={[
              0,
              ...graduationMarks.map((m) => m.grade4 * scaleCoefficient),
              4 * scaleCoefficient,
            ]}
          />
          <YAxis hide domain={[0, 3]} />
          {graduationMarks.map((mark) => (
            <ReferenceLine
              key={`graduation-${mark.grade4}`}
              stroke="#3B82F6"
              strokeDasharray="5 5"
              strokeWidth={2}
              x={mark.grade4 * scaleCoefficient}
            />
          ))}
          {minMark && (
            <ReferenceLine
              stroke="#EF4444"
              strokeWidth={2}
              x={minMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-40}
                position="insideTop"
                value="MIN"
              />
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-20}
                position="insideTop"
                value={`${minMark.grade4}`}
              />
            </ReferenceLine>
          )}
          {currentMark && (
            <ReferenceLine
              stroke="green"
              strokeWidth={2}
              x={currentMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="green"
                fontSize={12}
                offset={-40}
                position="insideTop"
                value="CURRENT"
              />
              <Label
                fill="green"
                fontSize={12}
                offset={-20}
                position="insideTop"
                value={`${currentMark.grade4}`}
              />
            </ReferenceLine>
          )}
          {maxMark && (
            <ReferenceLine
              stroke="#EF4444"
              strokeWidth={2}
              x={maxMark.grade4 * scaleCoefficient}
            >
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-40}
                position="insideTop"
                value="MAX"
              />
              <Label
                fill="#EF4444"
                fontSize={12}
                offset={-20}
                position="insideTop"
                value={`${maxMark.grade4}`}
              />
            </ReferenceLine>
          )}
          <Area
            data={area.data}
            dataKey="value"
            fill={area.color}
            fillOpacity={0.1}
            stroke="transparent"
          />
          <Tooltip content={<CustomTooltip />} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full bg-color-1 text-color-15">
          <thead>
            <tr>
              <th className="border border-color-15 py-2 px-4">
                Graduation Mark
              </th>
              <th className="border border-color-15 py-2 px-4">Is Possible</th>
              <th className="border border-color-15 py-2 px-4">Cases</th>
            </tr>
          </thead>
          <tbody>
            {graduationMarks.map((mark, index) => {
              const allGrades =
                mark.details.cases?.flatMap((caseItem) =>
                  caseItem.grades
                    ?.map((grade) => grade.gradeLatin)
                    .filter(Boolean)
                ) || [];
              const gradeOrder = [
                "A+",
                "A",
                "A-",
                "B+",
                "B",
                "B-",
                "C+",
                "C",
                "C-",
                "D+",
                "D",
              ];
              const lowestGrade =
                allGrades.sort(
                  (a, b) =>
                    gradeOrder.indexOf(a ?? "") - gradeOrder.indexOf(b ?? "")
                )[allGrades.length - 1] || "D";
              const currentIndex = gradeOrder.indexOf(lowestGrade);
              const nextGrade =
                currentIndex > 0 ? gradeOrder[currentIndex - 1] : lowestGrade;

              return (
                <tr key={index} className="border border-color-15">
                  <td className="border border-color-15 py-2 px-4">
                    {mark.details.content}
                  </td>
                  <td className="border border-color-15 py-2 px-4 text-center">
                    {mark.details.isPossibly !== undefined
                      ? mark.details.isPossibly
                        ? "Yes"
                        : "No"
                      : "N/A"}
                  </td>
                  <td className="border border-color-15 py-2 px-4">
                    {mark.details.cases && mark.details.cases.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-color-15 text-xs">
                          You need at least the credits shown below. Aim for
                          higher grades (e.g., {lowestGrade} to {nextGrade}).
                        </p>
                        {mark.details.cases.map((caseItem, caseIndex) => (
                          <div key={caseIndex}>
                            <h4 className="text-color-B7 text-sm">
                              Case {caseIndex + 1}
                            </h4>
                            <table className="w-full bg-color-1 border rounded-md text-sm mt-1">
                              <thead>
                                <tr>
                                  <th className="py-1 px-3">Minimum Grade</th>
                                  <th className="py-1 px-3">
                                    Required Credits
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {caseItem.grades?.map((grade, gradeIndex) => (
                                  <tr key={gradeIndex}>
                                    <td className="py-1 px-3 text-center">
                                      {grade.gradeLatin || "N/A"}
                                    </td>
                                    <td className="py-1 px-3 text-center">
                                      {grade.credits !== undefined
                                        ? grade.credits
                                        : "N/A"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No cases available"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksGraph;
