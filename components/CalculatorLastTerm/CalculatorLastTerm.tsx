"use client";

import React, { useState, useEffect } from "react";

import InputTable from "./InputTable";
import OutputTable from "./OutputTable";

// VNU Conversion Table
const VNU_CONVERSION_TABLE = {
  scores: [
    { letter: "A+", score10: 9.0, score4: 4.0 },
    { letter: "A", score10: 8.5, score4: 3.7 },
    { letter: "B+", score10: 8.0, score4: 3.5 },
    { letter: "B", score10: 7.0, score4: 3.0 },
    { letter: "C+", score10: 6.5, score4: 2.5 },
    { letter: "C", score10: 6.0, score4: 2.0 },
    { letter: "D+", score10: 5.5, score4: 1.5 },
    { letter: "D", score10: 4.0, score4: 1.0 },
    { letter: "F", score10: 0.0, score4: 0.0 },
  ],
};

const CaculatorLastTerm: React.FC = () => {
  const [inputs, setInputs] = useState([
    {
      title: "Attendance",
      score: (Math.random() * 10).toFixed(1),
      coefficient: "0.2",
    },
    {
      title: "Midterm",
      score: (Math.random() * 10).toFixed(1),
      coefficient: "0.3",
    },
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  interface Result {
    letter: string;
    score4: number;
    minScore: number | null;
    description: string;
  }

  const validateInputs = () => {
    const newErrors: string[] = [];
    const totalCoefficient = inputs.reduce(
      (sum, input) => sum + Number(input.coefficient || 0),
      0,
    );

    inputs.forEach((input, index) => {
      const score = Number(input.score);
      const coefficient = Number(input.coefficient);

      if (isNaN(score) || score < 0 || score > 10) {
        newErrors.push(`Score in row ${index + 1} must be between 0 and 10.`);
      }
      if (isNaN(coefficient) || coefficient <= 0 || coefficient >= 1) {
        newErrors.push(
          `Coefficient in row ${index + 1} must be between 0 and 1.`,
        );
      }
    });

    if (totalCoefficient >= 1) {
      newErrors.push(
        `Total coefficients must be less than 1 (current: ${totalCoefficient.toFixed(2)}).`,
      );
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const calculateResults = () => {
    if (!validateInputs()) {
      return VNU_CONVERSION_TABLE.scores.slice(0, -1).map((grade) => ({
        letter: grade.letter,
        score4: grade.score4,
        minScore: null,
        description: "",
      }));
    }

    const totalCoefficient = inputs.reduce(
      (sum, input) => sum + Number(input.coefficient),
      0,
    );
    const finalCoefficient = 1 - totalCoefficient;
    if (finalCoefficient <= 0) {
      return VNU_CONVERSION_TABLE.scores.slice(0, -1).map((grade) => ({
        letter: grade.letter,
        score4: grade.score4,
        minScore: null,
        description: "",
      }));
    }

    const currentScore = inputs.reduce(
      (sum, input) =>
        sum + Number(input.score || 0) * Number(input.coefficient),
      0,
    );

    return VNU_CONVERSION_TABLE.scores.slice(0, -1).map((grade) => {
      const minScore = (grade.score10 - currentScore) / finalCoefficient;
      // const roundedMinScore = Math.max(
      //   0,
      //   Math.min(10, Math.round(minScore * 100) / 100)
      // );
      const roundedMinScore = Math.round(minScore * 100) / 100;
      let description = "";

      if (minScore > 10) {
        description = `Reaching ${grade.letter} is impossible.`;
      } else if (minScore <= 0) {
        description = `You’ve got ${grade.letter} in the bag!`;
      } else {
        description = `Score at least ${roundedMinScore} to secure ${grade.letter}.`;
      }

      return {
        letter: grade.letter,
        score4: grade.score4,
        minScore: roundedMinScore,
        description,
      };
    });
  };

  useEffect(() => {
    setResults(calculateResults());
  }, [inputs]);

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg shadow-cyan-500/20">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
        Final Exam Score Calculator
      </h1>
      <InputTable
        errors={errors}
        inputs={inputs}
        setErrors={setErrors}
        setInputs={setInputs}
      />
      <OutputTable results={results} />
    </div>
  );
};

export default CaculatorLastTerm;
