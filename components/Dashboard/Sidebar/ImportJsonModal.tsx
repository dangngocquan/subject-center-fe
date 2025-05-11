import React, { useState } from "react";

import GenericModal from "@/components/Common/GenericModal";

interface ImportJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const ImportPlanByJsonModal: React.FC<ImportJsonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
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
      setSelectedFile(null); // Reset sau khi submit
    } else {
      alert("Please select a JSON file before submitting.");
    }
  };

  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center text-color-15 font-sans p-4 sm:p-6">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-color-15 to-color-5">
          Customize By Importing JSON
        </h3>
        <p className="text-color-15 mb-4">
          The JSON file should follow this format
        </p>
        <pre className="border border-color-15 bg-color-1 text-color-15 p-4 rounded-lg mb-6 text-left whitespace-pre-wrap overflow-x-auto text-sm">
          {`{
  "name": "My Plan",
  "items": [
    {
      "name": "Advanced Math",
      "code": "MATH101",
      "credit": 3,
      "prerequisites": []
    },
    {
      "name": "General Physics",
      "code": "PHYS102",
      "credit": 4,
      "prerequisites": ["MATH101"]
    }
  ]
}`}
        </pre>
        <div className="mb-6">
          <label className="inline-block bg-color-1 text-color-15 rounded-lg px-4 py-2 cursor-pointer hover:bg-color-6 transition-all duration-300 border border-color-15">
            Select JSON File
            <input
              accept="application/json"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <p className="text-color-15 mt-2">Selected: {selectedFile.name}</p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="min-w-[200px] bg-gradient-to-r from-color-6 to-color-1 text-color-15 rounded-lg px-4 py-2 hover:from-color-9 hover:to-color-1 transition-all duration-300 border border-color-15 shadow-lg hover:shadow-color-15/50"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImportPlanByJsonModal;
