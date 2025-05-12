// components/TimeTable/TimeTableResult.tsx
"use client";

import React, { useState, useRef } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";

import { TimeTable } from "../types";

import TimeTableGrid from "./TimeTableGrid";

import GenericPagination from "@/components/Common/GenericPagination";
import GenericButton from "@/components/Common/GenericButton";

interface TimeTableResultProps {
  timetables: TimeTable[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  colorMap: {
    [courseCode: string]: { bg: string; border: string; hoverShadow: string };
  };
}

const TimeTableResult: React.FC<TimeTableResultProps> = ({
  timetables,
  currentIndex,
  setCurrentIndex,
  colorMap,
}) => {
  const [itemsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Xử lý fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      resultRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

  // Lắng nghe sự kiện thay đổi fullscreen
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (timetables.length === 0) {
    return (
      <div className="border p-4 bg-color-1 text-color-15 rounded-lg">
        Chưa có timetable nào.
      </div>
    );
  }

  // Tính toán timetable hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTimetables = timetables.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      ref={resultRef}
      className="border p-4 bg-color-1 text-color-15 rounded-lg flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-color-15">Result</h2>
        </div>
        <GenericButton
          className="text-sm"
          tooltipContent={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          tooltipId="fullscreen-tooltip"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
        </GenericButton>
      </div>
      {/* Phân trang */}
      <div className="mt-4 shrink-0">
        <GenericPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          maxVisiblePages={5}
          setCurrentPage={setCurrentPage}
          totalItems={timetables.length}
        />
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {currentTimetables.map((timetable, idx) => (
          <TimeTableGrid
            key={indexOfFirstItem + idx}
            colorMap={colorMap} // Truyền colorMap vào TimeTableGrid
            index={indexOfFirstItem + idx}
            timetable={timetable}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeTableResult;
