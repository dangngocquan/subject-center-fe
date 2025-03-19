"use client";

import React from "react";
import Link from "next/link";
import { useMajors } from "@/hooks/useMajors";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";
import LoadingModal from "@/components/LoadingModal";

const MajorsPage: React.FC = () => {
  const { majors, loading, error } = useMajors("");

  // Giả định dữ liệu lastUpdated (thay bằng dữ liệu thực tế từ API nếu có)
  const majorsWithUpdate = majors.map((major) => ({
    ...major,
    lastUpdated: major.updatedAt || "2025-03-18", // Mặc định nếu không có
  }));

  if (loading) return <LoadingModal isOpen={loading} />;

  if (error)
    return (
      <p className="text-red-500 text-center py-10">Đã xảy ra lỗi: {error}</p>
    );

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: "#0A1A2F" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 md:mb-12 text-center">
        Danh sách các ngành đào tạo
      </h1>
      {majorsWithUpdate.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          Không có ngành nào để hiển thị.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {majorsWithUpdate.map((major: Major) => (
            <motion.div
              key={major.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              }}
              className="rounded-lg bg-[#1A2A44] border border-gray-700 p-5 hover:bg-[#1F2F4A] transition-all duration-300 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-900/10 opacity-50 rounded-lg"></div>
              <Link href={`/major/${major.id}`}>
                <div className="relative flex flex-col h-full">
                  {/* Header: Icon và tên major */}
                  <div className="flex items-center mb-3">
                    <FaBook size={20} className="text-[#4A90E2] mr-3" />
                    <h2 className="text-xl font-semibold text-white truncate">
                      {major.name}
                    </h2>
                  </div>

                  {/* Thời gian cập nhật */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gray-800 text-[#A0AEC0] text-xs font-medium rounded">
                      Cập nhật lần cuối:{" "}
                      {`${new Date(major.updatedAt ?? new Date())}`}
                    </span>
                  </div>

                  {/* Nút Details */}
                  <div className="mt-auto flex justify-end">
                    <motion.button
                      whileHover={{
                        borderColor: "#4A90E2",
                        color: "#4A90E2",
                        boxShadow: "0 0 10px rgba(74, 144, 226, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="py-1 px-4 border border-[#4A90E2] text-[#4A90E2] font-medium rounded-md hover:text-[#357ABD] hover:border-[#357ABD] transition-all duration-300"
                    >
                      Details
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MajorsPage;
