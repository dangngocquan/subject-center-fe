import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";

interface GenericInputSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  className?: string;
}

const GenericInputSearch: React.FC<GenericInputSearchProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...", // Updated placeholder text to English
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex-grow w-full sm:w-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none z-10">
        <FaSearch className="w-6 h-6 text-cyan-400" />
      </div>
      <input
        ref={inputRef}
        className="w-full py-4 pl-14 pr-12 rounded-md bg-gray-900/80 backdrop-blur-md text-cyan-400/50 placeholder-cyan-400/50 border border-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:border-cyan-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:opacity-0"
        placeholder={placeholder}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <motion.button
          className="absolute inset-y-0 right-0 flex items-center pr-5 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClearSearch}
        >
          <FaTimes className="w-5 h-5 text-cyan-400 hover:text-cyan-300 transition-all duration-300" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default GenericInputSearch;
