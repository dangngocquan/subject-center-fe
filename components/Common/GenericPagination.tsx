import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import GenericButton from "./GenericButton";

interface GenericPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
  className?: string;
}

const GenericPagination: React.FC<GenericPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5,
  className = "",
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleJumpToPage = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page.toString());
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const handleJumpToPageOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleJumpToPage();
    }
  };

  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Group 1: Navigation buttons and dots */}
      <div className="flex items-center gap-4 w-full">
        <GenericButton
          disabled={currentPage === 1}
          tooltipContent="Previous page"
          tooltipId="prev-page-tooltip"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaChevronLeft className="w-5 h-5" />
        </GenericButton>

        <div className="flex items-center gap-3 flex-1 justify-center">
          {visiblePages[0] > 1 && (
            <span className="text-color-15 text-sm">...</span>
          )}

          {visiblePages.map((page) => (
            <motion.button
              key={page}
              className={`w-3 h-3 rounded-md border border-color-15 shadow-lg shadow-color-15 ${
                currentPage === page
                  ? "bg-color-1"
                  : "bg-color-10 backdrop-blur-md hover:bg-color-1/20"
              } transition-all duration-200`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(page)}
            />
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <span className="text-color-15 text-sm">...</span>
          )}
        </div>

        <GenericButton
          disabled={currentPage === totalPages}
          tooltipContent="Next page"
          tooltipId="next-page-tooltip"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FaChevronRight className="w-5 h-5" />
        </GenericButton>
      </div>

      {/* Group 2: Jump to page input (with confirm button inside) and pagination info */}
      <div className="flex items-center justify-between w-full max-w-[300px]">
        <div className="relative">
          <input
            className="w-16 sm:w-16 py-1 pl-2 pr-8 rounded-md bg-color-1 backdrop-blur-md text-color-15  focus:outline-none focus:ring-2 focus:ring-color-15 focus:border-color-15 transition-all duration-300 shadow-lg shadow-color-15/20 hover:shadow-color-15/30 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            max={totalPages}
            min={1}
            placeholder="Page"
            type="number"
            value={inputPage}
            onBlur={handleJumpToPage}
            onChange={handleInputChange}
            onKeyDown={handleJumpToPageOnEnter}
          />
          <motion.button
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleJumpToPage}
          >
            <FaArrowRight className="w-4 h-4 text-color-15 hover:text-color-15 transition-all duration-300" />
          </motion.button>
        </div>

        <span className="ml-2 text-color-15 text-sm bg-color-1 backdrop-blur-md px-3 py-1 rounded-md shadow-lg shadow-color-15/20">
          {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}/
          {totalItems} • Page {currentPage}/{totalPages}
        </span>
      </div>
    </div>
  );
};

export default GenericPagination;
