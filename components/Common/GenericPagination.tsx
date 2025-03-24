import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

import { GenericButton } from "./GenericButton";

interface GenericPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
}

const GenericPagination: React.FC<GenericPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5,
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
    e: React.KeyboardEvent<HTMLInputElement>
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
    <div className="flex flex-col items-center gap-2">
      {/* Nhóm 1: Nút điều hướng và chấm tròn */}
      <div className="flex items-center gap-4">
        <GenericButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          tooltipContent="Trang trước"
          tooltipId="prev-page-tooltip"
        >
          <FaChevronLeft className="w-5 h-5" />
        </GenericButton>

        <div className="flex items-center gap-3">
          {visiblePages[0] > 1 && (
            <span className="text-cyan-400/70 text-sm">...</span>
          )}

          {visiblePages.map((page) => (
            <motion.button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-3 h-3 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/20 ${
                currentPage === page
                  ? "bg-cyan-400"
                  : "bg-gray-900/80 backdrop-blur-md hover:bg-cyan-400/20"
              } transition-all duration-300`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <span className="text-cyan-400/70 text-sm">...</span>
          )}
        </div>

        <GenericButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          tooltipContent="Trang sau"
          tooltipId="next-page-tooltip"
        >
          <FaChevronRight className="w-5 h-5" />
        </GenericButton>
      </div>

      {/* Nhóm 2: Input nhảy trang (với nút xác nhận bên trong) và thông tin phân trang */}
      <div className="flex items-center justify-between w-full max-w-[300px]">
        <div className="relative">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={handleInputChange}
            onBlur={handleJumpToPage}
            onKeyDown={handleJumpToPageOnEnter}
            className="w-16 sm:w-16 py-1 pl-2 pr-8 rounded-full bg-gray-900/80 backdrop-blur-md text-cyan-400/50 border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:border-cyan-400 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Trang"
          />
          <motion.button
            onClick={handleJumpToPage}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowRight className="w-4 h-4 text-cyan-400 hover:text-cyan-300 transition-all duration-300" />
          </motion.button>
        </div>

        {totalPages > 0 && (
          <span className="text-cyan-400/70 text-sm bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg shadow-cyan-500/20">
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}/
            {totalItems} • Trang {currentPage}/{totalPages}
          </span>
        )}
      </div>
    </div>
  );
};

export default GenericPagination;
