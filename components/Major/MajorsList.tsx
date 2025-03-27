import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { FaBook } from "react-icons/fa";

import GenericInputSearch from "../Common/GenericInputSearch";
import GenericPagination from "../Common/GenericPagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const currentMajors = majors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-8 text-center">
        List of Majors
      </h1>
      {/* Thanh tìm kiếm và phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto mb-12 gap-4">
        <GenericInputSearch
          placeholder="Search for a major..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <GenericPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          maxVisiblePages={5}
          setCurrentPage={setCurrentPage}
          totalItems={majors.length}
        />
      </div>

      {/* List of majors */}
      {currentMajors.length > 0 &&
        currentMajors.map((major: Major, index: number) => (
          <motion.div
            key={major.id}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 p-6 hover:bg-gray-800/90 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 24px rgba(0, 255, 255, 0.3)",
            }}
          >
            <Link href={`/major/${major.id}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-full gap-4">
                <div className="flex items-center mb-2 sm:mb-0 flex-grow">
                  <FaBook
                    className="text-cyan-400 mr-4 flex-shrink-0"
                    size={24}
                  />
                  <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                    {major.name}
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:flex-shrink-0">
                  <motion.button
                    className="py-2 px-6 bg-gray-900/80 backdrop-blur-md text-cyan-400 font-medium rounded-md border border-cyan-500/30 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 shadow-lg shadow-cyan-500/20"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 12px rgba(0, 255, 255, 0.4)",
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
      {currentMajors.length === 0 && (
        <div className="rounded-lg bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 p-6 shadow-lg shadow-cyan-500/20 flex items-center justify-center h-[96px]">
          <p className="text-cyan-400/50 text-center text-lg">
            No majors to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default MajorsList;
