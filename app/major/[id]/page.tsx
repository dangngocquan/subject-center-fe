"use client";

import React from "react";
import { useParams } from "next/navigation";

import MajorDetail from "@/components/Major/MajorDetail";

const MajorDetailPage = () => {
  const params = useParams();
  const { id } = params;

  if (!id) {
    return <p className="text-gray-500">Không tìm thấy ID major.</p>;
  }

  return <MajorDetail id={id as string} />;
};

export default MajorDetailPage;
