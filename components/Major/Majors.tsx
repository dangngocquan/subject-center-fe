"use client";

import Link from "next/link";
import React from "react";

import { useMajors } from "@/hooks/useMajors";
import LoadingModal from "../LoadingModal";

const MajorsPage: React.FC = () => {
  const { majors, loading, error } = useMajors(""); // Sử dụng hook useMajors

  if (loading) return <LoadingModal isOpen={loading} />;
  if (error) return <p className="text-red-500">Đã xảy ra lỗi: {error}</p>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0A1A2F" }}>
      <h1 className="text-3xl font-bold text-white mb-6">
        Danh sách các ngành đào tạo
      </h1>
      {majors.length === 0 ? (
        <p className="text-gray-400">Không có ngành nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {majors.map((major: Major, index: number) => (
            <Link key={`${major.id}-${index}`} href={`/major/${major.id}`}>
              <div
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: "#1A2A44" }}
              >
                <h2 className="text-xl font-semibold text-white">
                  {major.name}
                </h2>
                <p className="text-gray-400 mt-2">
                  Số môn: {major.items.length}
                </p>
                <p className="text-[#4A90E2] mt-2">Xem chi tiết →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MajorsPage;
