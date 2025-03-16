const GPASection: React.FC = () => {
  return (
    <div className="bg-gray-900/80 rounded-lg p-3 md:p-6 shadow-lg shadow-cyan-500/20">
      <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2 md:mb-4">
        GPA
      </h2>
      <div className="relative w-full h-32 md:h-48 flex items-center justify-center">
        <div className="absolute w-20 h-20 md:w-32 md:h-32 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-2xl">
          6.5
        </div>
        <div className="absolute text-gray-400 text-xs md:text-sm mt-12 md:mt-16">
          Target: 7.0
        </div>
      </div>
    </div>
  );
};

export default GPASection;
