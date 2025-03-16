import PlansNavbar from "@/components/PlansNavbar";
import PlansSidebar from "@/components/PlansSidebar";
import PlansMain from "@/components/PlansMain";

const Plans: React.FC = () => {
  return (
    <div>
      <PlansNavbar />
      <PlansSidebar />
      <PlansMain />
    </div>
  );
};

export default Plans;
