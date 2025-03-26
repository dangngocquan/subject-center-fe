import React, { useState } from "react";

import GenericModal from "@/components/Common/GenericModal";

const ImportJsonModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    } else {
      alert("Please select a JSON file before submitting.");
    }
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Import JSON to Update Grades
        </h3>
        <p className="text-gray-300 mb-4">
          The JSON file should follow this format:
        </p>
        <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap overflow-x-auto">
          {`{
  "subjects": [
    {
      "name": "Advanced Math",
      "code": "MATH101",
      "credit": 3,
      "gradeLatin": "A"
    },
    {
      "name": "General Physics",
      "code": "PHYS102",
      "credit": 4,
      "gradeLatin": "B+"
    }
  ]
}`}
        </pre>
        <div className="mb-6">
          <label className="inline-block bg-gray-700 text-gray-300 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-600 transition-all duration-300 border border-gray-500">
            Import File from Device
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <p className="text-gray-400 mt-2">Selected: {selectedFile.name}</p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-600 text-white rounded-full px-4 py-2 hover:bg-gray-700 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700 transition-all duration-300"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportJsonModal;
