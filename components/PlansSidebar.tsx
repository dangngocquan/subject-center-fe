const PlansSidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-gray-900/80 p-4 h-screen fixed left-0 top-16 z-40 shadow-lg shadow-cyan-500/20">
      <ul className="space-y-4">
        {["Total", "Hemby", "Paarle", "Team"].map((item) => (
          <li
            key={item}
            className="text-gray-300 hover:text-cyan-400 cursor-pointer transition-colors text-sm md:text-base"
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default PlansSidebar;
