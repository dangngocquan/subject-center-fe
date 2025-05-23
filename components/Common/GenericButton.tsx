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
    "bg-color-1 backdrop-blur-md text-color-15 border-color-15 hover:bg-color-G3 hover:text-color-15";

  // Disabled state styles
  const disabledStyles =
    "bg-color-5 text-color-15 border-color-15 cursor-not-allowed";

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
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 1)",
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
