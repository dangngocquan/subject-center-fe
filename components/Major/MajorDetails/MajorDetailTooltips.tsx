"use client";

import React from "react";
import { Tooltip } from "react-tooltip";

const MajorDetailTooltips: React.FC = () => {
  return (
    <>
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50"
        id="expand-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50"
        id="mode-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50"
        id="reset-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50"
        id="select-all-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-white p-2 rounded z-50"
        id="create-plan-tooltip"
        place="bottom"
      />
    </>
  );
};

export default MajorDetailTooltips;
