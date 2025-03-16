import { ScheduleCard } from "@/types";

interface ScheduleSmallCardProps extends ScheduleCard {}

const ScheduleSmallCard: React.FC<ScheduleSmallCardProps> = ({
  title,
  subtitle,
  time,
}) => {
  return (
    <div className="bg-cyan-500/30 p-2 md:p-4 rounded-lg hover:bg-cyan-500/50 transition-colors">
      <div className="text-white font-medium text-sm md:text-base">{title}</div>
      <div className="text-gray-300 text-xs md:text-sm">{subtitle}</div>
      {time && <div className="text-cyan-200 text-xs md:text-sm">{time}</div>}
    </div>
  );
};

export default ScheduleSmallCard;
