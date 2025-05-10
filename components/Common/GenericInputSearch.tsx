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
  placeholder = "Search...",
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
      className={`w-full sm:w-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Container flex với viền và nền, bao quanh cả icon và input */}
      <div className="flex items-center w-full py-4 px-4 rounded-md bg-color-1/80 backdrop-blur-md border border-color-10/30 focus-within:ring-2 focus-within:ring-color-15/80 focus-within:border-color-15 transition-all duration-300 shadow-lg shadow-color-15/20 hover:shadow-color-15/30 hover:border-color-15">
        {/* Icon FaSearch nằm trong container */}
        <FaSearch className="w-6 h-6 text-color-15 mr-2" />

        {/* Input không có viền riêng, chỉ có padding */}
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-color-15 placeholder-color-15/50 focus:outline-none placeholder:transition-all placeholder:duration-300 focus:placeholder:opacity-0"
          placeholder={placeholder}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Icon FaTimes nằm trong container */}
        {searchTerm && (
          <motion.button
            className="ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClearSearch}
          >
            <FaTimes className="w-5 h-5 text-color-15 hover:text-color-15 transition-all duration-300" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default GenericInputSearch;
