"use client";

import React from "react";
import { useParams } from "next/navigation";

import MajorDetail from "@/components/Major/MajorDetails";

const MajorDetailPage = () => {
  const params = useParams();
  const { id } = params;

  if (!id) {
    return <p className="text-color-15">Không tìm thấy ID major.</p>;
  }

  return <MajorDetail id={id as string} />;
};

export default MajorDetailPage;
