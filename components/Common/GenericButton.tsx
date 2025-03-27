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
  // Base styles for the button
  const baseStyles =
    "p-3 rounded-md border transition-all duration-300 shadow-lg";

  // Enabled state styles
  const enabledStyles =
    "bg-gray-900/80 backdrop-blur-md text-cyan-400 border-cyan-500/30 hover:bg-cyan-400 hover:text-gray-900 shadow-cyan-500/20";

  // Disabled state styles
  const disabledStyles =
    "bg-gray-500 text-gray-300 border-gray-600/30 cursor-not-allowed shadow-gray-500/20";

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${className}`}
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
              // scale: 1.05,
              transform: "translateY(-2px)",
              boxShadow: "0 0 12px rgba(0, 255, 255, 0.4)",
            }
      }
      whileTap={disabled ? undefined : { scale: 1 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default GenericButton;
