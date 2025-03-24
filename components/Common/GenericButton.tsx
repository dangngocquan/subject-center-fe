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
      className={`p-3 bg-gray-900/80 backdrop-blur-md text-cyan-400 rounded-full border border-cyan-500/30 transition-all duration-300 ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-cyan-400 hover:text-gray-900"
      } shadow-lg shadow-cyan-500/20 ${className}`}
      data-tooltip-content={tooltipContent}
      data-tooltip-id={tooltipId}
      disabled={disabled}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.1,
              boxShadow: "0 0 12px rgba(0, 255, 255, 0.4)",
            }
      }
      whileTap={disabled ? undefined : { scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default GenericButton;
