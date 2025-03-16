const PlansNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-cyan-500/20 w-full">
      <div className="flex items-center space-x-4">
        <div className="text-white font-bold text-xl md:text-2xl">Tower &</div>
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block bg-gray-800 text-white placeholder-gray-400 rounded-full px-4 py-2 w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <button className="border border-cyan-400 text-cyan-400 rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base hover:bg-cyan-400/20 transition-colors">
          Schedule
        </button>
        <button className="bg-cyan-500 text-white rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base hover:bg-cyan-600 transition-colors">
          Play
        </button>
      </div>
    </nav>
  );
};

export default PlansNavbar;
