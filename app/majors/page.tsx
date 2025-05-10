"use client";

import React, { useState } from "react";

import LoadingModal from "@/components/LoadingModal";
import { useMajors } from "@/hooks/useMajors";
import MajorsList from "@/components/Major/MajorsList";
import { Major } from "@/types/major";

const MajorsPage: React.FC = () => {
  const { majors, loading, error } = useMajors("");
  const [searchTerm, setSearchTerm] = useState("");

  // Format the date to match the screenshot
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toString();
  };

  // Add lastUpdated to majors
  const majorsWithUpdate = majors.map((major: Major) => ({
    ...major,
    lastUpdated: formatDate(`${major.updatedAt}` || "2025-03-18"),
  }));

  // Filter majors based on search term
  const filteredMajors = majorsWithUpdate.filter((major: Major) =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <LoadingModal isOpen={loading} />;
  if (error)
    return (
      <p className="text-red-500 text-center py-10 text-lg">
        Đã xảy ra lỗi: {error}
      </p>
    );

  return (
    <div className="min-h-screen p-6 md:p-8 bg-primary">
      {/* Majors List */}
      <MajorsList
        majors={filteredMajors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default MajorsPage;
