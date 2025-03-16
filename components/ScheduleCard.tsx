import { Course } from "@/types";

interface ScheduleCardProps extends Course {}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ day, name, score }) => {
  return (
    <div className="bg-cyan-500/30 p-2 md:p-4 rounded-lg hover:bg-cyan-500/50 transition-colors">
      <div className="text-gray-300 text-xs md:text-sm">{day}</div>
      <div className="text-white font-medium text-sm md:text-base">{name}</div>
      <div className="text-cyan-200 text-xs md:text-sm">Score: {score}</div>
    </div>
  );
};

export default ScheduleCard;
