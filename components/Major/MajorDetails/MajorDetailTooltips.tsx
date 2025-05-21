"use client";

import React from "react";
import { Tooltip } from "react-tooltip";

const MajorDetailTooltips: React.FC = () => {
  return (
    <>
      <Tooltip
        className="bg-[#2A3A54] text-color-15 p-2 rounded z-50"
        id="expand-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-color-15 p-2 rounded z-50"
        id="mode-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-color-15 p-2 rounded z-50"
        id="toggle-selection-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-color-15 p-2 rounded z-50"
        id="create-plan-tooltip"
        place="bottom"
      />
      <Tooltip
        className="bg-[#2A3A54] text-color-15 p-2 rounded z-50"
        id="view-mode-tooltip"
        place="bottom"
      />
    </>
  );
};

export default MajorDetailTooltips;
