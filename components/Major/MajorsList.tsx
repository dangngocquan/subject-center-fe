import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { FaBook } from "react-icons/fa";

import GenericInputSearch from "../Common/GenericInputSearch";
import GenericPagination from "../Common/GenericPagination";

import { Major } from "@/types/major";
import { siteConfig } from "@/config/site";

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
  const itemsPerPage = 10;

  const currentMajors = majors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-color-15 to-color-5 bg-clip-text text-transparent mb-8 text-center">
        List of Majors
      </h1>
      {/* Thanh tìm kiếm và phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full flex-between gap-4">
        <GenericInputSearch
          placeholder="Search for a major..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className="flex-1 max-w-[66%]"
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
          <Link
            key={major.id}
            href={`${siteConfig.routers.majorDetails(String(major?.id))}`}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-color-1/80 backdrop-blur-md border border-color-15/30 px-6 py-2 hover:bg-color-5/90 transition-all duration-300 shadow-lg shadow-color-15/20 hover:shadow-color-15/30"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              whileHover={{
                // scale: 1.02,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-full gap-4">
                <div className="flex items-center mb-2 sm:mb-0 flex-grow">
                  <FaBook
                    className="text-color-15 mr-4 flex-shrink-0"
                    size={20}
                  />
                  <h2 className="text-s font-semibold text-color-15 bg-gradient-to-r from-color-15 to-color-1 bg-clip-text ">
                    {major.name}
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:flex-shrink-0">
                  <motion.button
                    className="py-2 px-6 bg-color-1/80 backdrop-blur-md text-color-15 font-medium rounded-md border border-color-15/30 hover:bg-color-6 hover:text-color-15 transition-all duration-300 shadow-lg shadow-color-15/20"
                    whileHover={{
                      // scale: 1.05,
                      boxShadow: "0 0 12px rgba(0, 0, 0, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {"Details"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      {currentMajors.length === 0 && (
        <div className="rounded-lg bg-color-1/80 backdrop-blur-md border border-color-15/30 p-6 shadow-lg shadow-color-15/20 flex items-center justify-center h-[96px]">
          <p className="text-color-15 text-center text-lg">
            No majors to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default MajorsList;
