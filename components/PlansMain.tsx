import GPASection from "./GPASection";
import GradesSection from "./GradesSection";
import GraphSection from "./GraphSection";
import ScheduleCardSection from "./ScheduleCardSection";
import ScheduleSection from "./ScheduleSection";

const PlansMain: React.FC = () => {
  return (
    <div className="w-full md:ml-64 p-4 md:p-8">
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <ScheduleSection />
          <GradesSection />
          <GPASection />
        </div>
        <GraphSection />
        <ScheduleCardSection />
      </div>
    </div>
  );
};

export default PlansMain;
