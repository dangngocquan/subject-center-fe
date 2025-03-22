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
          <div className="bg-gray-900/90 p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto" />
            <p className="text-white mt-4">Waiting ...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;
