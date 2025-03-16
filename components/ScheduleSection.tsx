import { Course } from "@/types";
import ScheduleCard from "./ScheduleCard";

const courses: Course[] = [
  { day: "Monday", name: "Web Programming", score: 7.5 },
  { day: "Wednesday", name: "Advanced Math", score: 6.5 },
];

const ScheduleSection: React.FC = () => {
  return (
    <div className="bg-gray-900/80 rounded-lg p-3 md:p-6 shadow-lg shadow-cyan-500/20">
      <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2 md:mb-4">
        Schedule
      </h2>
      <div className="space-y-2 md:space-y-4">
        {courses.map((course, index) => (
          <ScheduleCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
