import { ScheduleCard } from "@/types";
import ScheduleSmallCard from "./ScheduleSmallCard";

const schedules: ScheduleCard[] = [
  { title: "Urgent", subtitle: "Project Fixout", time: "8:00-10:00" },
  { title: "Final", subtitle: "Project Deadline", time: "14:00-16:00" },
];

const ScheduleCardSection: React.FC = () => {
  return (
    <div className="bg-gray-900/80 rounded-lg p-3 md:p-6 shadow-lg shadow-cyan-500/20">
      <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2 md:mb-4">
        Schedule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        {schedules.map((schedule, index) => (
          <ScheduleSmallCard key={index} {...schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleCardSection;
