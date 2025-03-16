import { Course } from "@/types";

interface CourseCardProps extends Course {}

const CourseCard: React.FC<CourseCardProps> = ({
  status,
  name,
  credits,
  time,
}) => {
  const statusColor = {
    Completed: "bg-green-500/30",
    "In Progress": "bg-cyan-500/30",
    Planned: "bg-gray-500/30",
    Scheduled: "bg-cyan-400/30",
  }[status];

  return (
    <div
      className={`p-2 md:p-4 rounded-lg ${statusColor} hover:bg-opacity-50 transition-colors`}
    >
      <div className="text-white font-medium text-sm md:text-base">{name}</div>
      {credits && (
        <div className="text-gray-300 text-xs md:text-sm">
          Credits: {credits}
        </div>
      )}
      {time && (
        <div className="text-gray-300 text-xs md:text-sm">Time: {time}</div>
      )}
      <div className="text-cyan-200 text-xs md:text-sm">{status}</div>
    </div>
  );
};

export default CourseCard;
