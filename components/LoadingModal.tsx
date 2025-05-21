import { motion, AnimatePresence } from "framer-motion";

interface LoadingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-color-15/50 p-6 rounded-lg text-center w-[150px] h-[150px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-color-G7 mx-auto" />
            <p className="text-color-15 mt-4">Loading ...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;
