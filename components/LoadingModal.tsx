const LoadingModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-gray-900/90 p-6 rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto" />
        <p className="text-white mt-4">Waiting ...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
