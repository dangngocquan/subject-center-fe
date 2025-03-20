import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBook, FaSearch } from "react-icons/fa";
import { Major } from "@/types/major";

interface MajorsListProps {
  majors: Major[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const MajorsList: React.FC<MajorsListProps> = ({
  majors,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-6">
        Danh Sách Ngành Học
      </h1>
      {/* Search Bar */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-5">
          <FaSearch className="w-6 h-6 text-gray-400" />
        </div>
        <input
          className="w-full py-4 pl-14 pr-5 rounded-full bg-[#1A2A44] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-4 focus:ring-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-gradient-to-r hover:from-cyan-400 hover:to-blue-500"
          placeholder="Tìm kiếm ngành đào tạo..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>
      {majors.length > 0 &&
        majors.map((major: Major, index: number) => (
          <motion.div
            key={major.id}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-gray-900 border border-gray-700 p-6 hover:bg-gray-800 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Link href={`/major/${major.id}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-full gap-4">
                {/* Left Section: Icon and Major Name */}
                <div className="flex items-center mb-2 sm:mb-0 flex-grow">
                  <FaBook className="text-cyan-400 ml-3 mr-8" size={25} />
                  <h2 className="text-lg font-semibold text-white">
                    {major.name}
                  </h2>
                </div>

                {/* Right Section: Details Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:flex-shrink-0">
                  <motion.button
                    className="py-2 px-4 border border-cyan-400 text-cyan-400 font-medium rounded-md hover:text-cyan-300 hover:border-cyan-300 transition-all duration-300"
                    whileHover={{
                      borderColor: "#00ACC1",
                      color: "#00ACC1",
                      boxShadow: "0 0 8px rgba(0, 172, 193, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      {majors.length === 0 && (
        <p className="text-gray-400 text-center py-10 text-lg">
          Không có ngành nào để hiển thị.
        </p>
      )}
    </div>
  );
};

export default MajorsList;
