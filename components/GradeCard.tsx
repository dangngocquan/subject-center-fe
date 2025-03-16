import { Grade } from "@/types";

interface GradeCardProps extends Grade {}

const GradeCard: React.FC<GradeCardProps> = ({ label, score }) => {
  return (
    <div className="bg-cyan-500/30 p-2 md:p-4 rounded-lg hover:bg-cyan-500/50 transition-colors">
      <div className="text-white font-medium text-sm md:text-base">{label}</div>
      <div className="text-cyan-200 text-xs md:text-sm">{score}</div>
    </div>
  );
};

export default GradeCard;