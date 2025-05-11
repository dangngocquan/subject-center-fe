import React from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import GenericButton from "../Common/GenericButton";

import ErrorDisplay from "./ErrorDisplay";

interface Input {
  title: string;
  score: string;
  coefficient: string;
}

interface InputTableProps {
  inputs: Input[];
  setInputs: React.Dispatch<React.SetStateAction<Input[]>>;
  errors: string[];
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

const InputTable: React.FC<InputTableProps> = ({
  inputs,
  setInputs,
  errors,
  setErrors,
}) => {
  const validateInput = () => {
    const newErrors: string[] = [];
    const totalCoefficient = inputs.reduce(
      (sum, input) => sum + Number(input.coefficient || 0),
      0
    );

    inputs.forEach((input, i) => {
      const score = Number(input.score);
      const coefficient = Number(input.coefficient);

      if (isNaN(score) || score < 0 || score > 10) {
        newErrors.push(`Score in row ${i + 1} must be between 0 and 10.`);
      }
      if (isNaN(coefficient) || coefficient <= 0 || coefficient >= 1) {
        newErrors.push(`Coefficient in row ${i + 1} must be between 0 and 1.`);
      }
    });

    if (totalCoefficient >= 1) {
      newErrors.push(
        `Total coefficients must be less than 1 (current: ${totalCoefficient.toFixed(2)}).`
      );
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange = (
    index: number,
    field: keyof Input,
    value: string
  ) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addRow = () => {
    setInputs([
      ...inputs,
      {
        title: "",
        score: (Math.random() * 10).toFixed(1),
        coefficient: (Math.random() * 0.4 + 0.1).toFixed(1), // Random từ 0.1 đến 0.5
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const hasError = (index: number, field: keyof Input) => {
    const value = inputs[index][field];
    if (field === "score") {
      const num = Number(value);
      return isNaN(num) || num < 0 || num > 10;
    }
    if (field === "coefficient") {
      const num = Number(value);
      const totalCoefficient = inputs.reduce(
        (sum, input) => sum + Number(input.coefficient || 0),
        0
      );
      return isNaN(num) || num <= 0 || num >= 1 || totalCoefficient >= 1;
    }
    return false;
  };

  React.useEffect(() => {
    validateInput();
  }, [inputs]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-color-15">
        Enter Your Scores
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-color-15">
          <thead>
            <tr className="bg-color-6">
              <th className="border border-color-15 p-3">Title</th>
              <th className="border border-color-15 p-3">Score</th>
              <th className="border border-color-15 p-3">Coefficient</th>
              <th className="border border-color-15 p-3 w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, index) => (
              <tr key={index} className="hover:bg-color-3 transition-colors">
                <td className="border border-color-13 p-2">
                  <input
                    className="w-full p-2 bg-color-1 text-color-15 border border-color-3 rounded focus:outline-none focus:ring-2 focus:ring-color-6"
                    placeholder="e.g., Attendance"
                    type="text"
                    value={input.title}
                    onChange={(e) =>
                      handleInputChange(index, "title", e.target.value)
                    }
                  />
                </td>
                <td className="border border-color-13 p-2">
                  <input
                    className={`w-full p-2 bg-color-1 text-color-15 border rounded focus:outline-none focus:ring-2 focus:ring-color-6 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      hasError(index, "score")
                        ? "border-color-R7"
                        : "border-color-B7"
                    }`}
                    placeholder="0-10"
                    type="number"
                    value={input.score}
                    onChange={(e) =>
                      handleInputChange(index, "score", e.target.value)
                    }
                  />
                </td>
                <td className="border border-color-13 p-2">
                  <input
                    className={`w-full p-2 bg-color-1 text-color-15 border rounded focus:outline-none focus:ring-2 focus:ring-color-6 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      hasError(index, "coefficient")
                        ? "border-color-R15"
                        : "border-color-G10"
                    }`}
                    placeholder="0.1-0.9"
                    type="number"
                    value={input.coefficient}
                    onChange={(e) =>
                      handleInputChange(index, "coefficient", e.target.value)
                    }
                  />
                </td>
                <td className="border border-color-13 p-2 text-center">
                  <GenericButton
                    className="p-2 hover:bg-color-R15 hover:text-color-15"
                    disabled={inputs.length === 1}
                    onClick={() => removeRow(index)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </GenericButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GenericButton
        className="mt-2 w-full flex justify-center py-3"
        onClick={addRow}
      >
        <PlusIcon className="w-6 h-6" />
      </GenericButton>
      <ErrorDisplay errors={errors} />
    </div>
  );
};

export default InputTable;
