// components/GenericButton.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";

interface GenericButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  tooltipContent?: string;
  tooltipId?: string;
  children: React.ReactNode;
  className?: string;
}

export const GenericButton: React.FC<GenericButtonProps> = ({
  onClick,
  disabled = false,
  tooltipContent,
  tooltipId,
  children,
  className = "",
}) => {
  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={`p-2 bg-gradient-to-r ${
        disabled
          ? "from-gray-500 to-gray-600 cursor-not-allowed"
          : "from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700"
      } text-white rounded-full transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed ${className}`}
      data-tooltip-content={tooltipContent}
      data-tooltip-id={tooltipId}
      disabled={disabled}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};
