import { Grade } from "@/types";
import GradeCard from "./GradeCard";

const grades: Grade[] = [
  { label: "Midterm", score: 7.5 },
  { label: "Assignment", score: 8.0 },
];

const GradesSection: React.FC = () => {
  return (
    <div className="bg-gray-900/80 rounded-lg p-3 md:p-6 shadow-lg shadow-cyan-500/20">
      <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2 md:mb-4">
        Grades
      </h2>
      <div className="space-y-2 md:space-y-4">
        {grades.map((grade, index) => (
          <GradeCard key={index} {...grade} />
        ))}
      </div>
    </div>
  );
};

export default GradesSection;
