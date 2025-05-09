import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 px-4 sm:px-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate="visible"
            className="bg-primary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-[90%] sm:max-w-4xl relative border border-color-15 backdrop-blur-sm"
            exit="exit"
            initial="hidden"
            // style={{ background: "rgba(26, 42, 68, 0.95)" }}
            variants={modalVariants}
          >
            <button
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-color-R4 hover:text-color-R10 transition-colors duration-200"
              onClick={onClose}
            >
              <FaTimes className="sm:w-4 sm:h-4" size={14} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenericModal;
