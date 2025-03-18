import { useState, useEffect } from "react";

import { PlanDetails } from "../types/plan";

export const usePlanDetails = (planId: string | null | undefined) => {
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanDetails = async (id: string) => {
    // setLoading(true);
    // setError(null);
    // try {
    //   const response = await fetch(`/api/v1/plans/${id}`);
    //   const data = await response.json();

    //   if (data.isBadRequest) {
    //     throw new Error(data.message || "Failed to fetch plan details");
    //   }

    //   setPlanDetails(data);
    // } catch (err) {
    //   setError("Something went wrong");
    // } finally {
    //   setLoading(false);
    // }
    setPlanDetails({
      credits: {
        items: [
          {
            id: "3",
            planId: "1",
            name: "Subject 3 - Plan 2",
            code: "s3p2",
            credit: "2",
            grade4: null,
            gradeLatin: null,
            prerequisites: ["s1p1"],
            orderIndex: 1742112190.279034,
            createdAt: "2025-03-16T08:03:10.279Z",
            updatedAt: "2025-03-16T08:03:10.279Z",
          },
          {
            id: "1",
            planId: "1",
            name: "Subject 1 - Plan 2",
            code: "s1p2",
            credit: "3",
            grade4: 4,
            gradeLatin: "A+",
            prerequisites: [],
            orderIndex: 1742112190.188966,
            createdAt: "2025-03-16T08:03:10.188Z",
            updatedAt: "2025-03-17T10:55:34.075Z",
          },
          {
            id: "2",
            planId: "1",
            name: "Subject 2 - Plan 2",
            code: "s2p2",
            credit: "4",
            grade4: 1,
            gradeLatin: "D",
            prerequisites: [],
            orderIndex: 1742112190.235789,
            createdAt: "2025-03-16T08:03:10.235Z",
            updatedAt: "2025-03-18T03:30:30.989Z",
          },
        ],
        totalCredits: 9,
        totalSubjects: 3,
        totalSubjectsCompleted: 2,
        totalCreditsCompleted: 7,
        totalSubjectsIncomplete: 1,
        totalCreditsIncomplete: 2,
        totalSubjectsCanImprovement: 1,
        totalCreditsCanImprovement: 4,
        currentCPA: 2.2857142857142856,
        grades: {
          "A+": {
            gradeLatin: "A+",
            count: 1,
            credits: 3,
          },
          D: {
            gradeLatin: "D",
            count: 1,
            credits: 4,
          },
        },
        totalGradeCompleted: 16,
        totalGradeCanImprovement: 4,
      },
      cpa: {
        withoutImprovements: {
          marks: [
            {
              grade4: 1,
              type: "GRADUATION_MARK",
              details: {
                content: "Poor (1.0 - 1.99) - Below satisfactory level",
              },
            },
            {
              grade4: 2,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Ordinary (2.0 - 2.49) - Acceptable but needs improvement",
              },
            },
            {
              grade4: 2,
              type: "MIN",
              details: {
                content:
                  "Your minimum CPA (2). This occurs when you receive a grade of D in all incomplete subjects.",
              },
            },
            {
              grade4: 2.29,
              type: "CURRENT",
              details: {
                content: "You current CPA (2.2857142857142856)",
              },
            },
            {
              grade4: 2.5,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Good (2.5 - 3.19) - Solid performance with some areas of improvement",
              },
            },
            {
              grade4: 2.67,
              type: "MAX",
              details: {
                content:
                  "Your maximum CPA (2.6666666666666665). This occurs when you receive a grade of A+ in all incomplete subjects.",
              },
            },
            {
              grade4: 3.2,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Very Good (3.2 - 3.59) - Strong performance with minor weaknesses",
              },
            },
            {
              grade4: 3.6,
              type: "GRADUATION_MARK",
              details: {
                content: "Excellent (3.6 - 4.0) - Outstanding performance",
              },
            },
          ],
        },
        withImprovements: {
          marks: [
            {
              grade4: 1,
              type: "GRADUATION_MARK",
              details: {
                content: "Poor (1.0 - 1.99) - Below satisfactory level",
              },
            },
            {
              grade4: 2,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Ordinary (2.0 - 2.49) - Acceptable but needs improvement",
              },
            },
            {
              grade4: 2,
              type: "MIN",
              details: {
                content:
                  "Your minimum CPA (2). This occurs when you receive a grade of D in all incomplete subjects and improvement subjects.",
              },
            },
            {
              grade4: 2.29,
              type: "CURRENT",
              details: {
                content: "You current CPA (2.2857142857142856)",
              },
            },
            {
              grade4: 2.5,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Good (2.5 - 3.19) - Solid performance with some areas of improvement",
              },
            },
            {
              grade4: 3.2,
              type: "GRADUATION_MARK",
              details: {
                content:
                  "Very Good (3.2 - 3.59) - Strong performance with minor weaknesses",
              },
            },
            {
              grade4: 3.6,
              type: "GRADUATION_MARK",
              details: {
                content: "Excellent (3.6 - 4.0) - Outstanding performance",
              },
            },
            {
              grade4: 4,
              type: "MAX",
              details: {
                content:
                  "Your maximum CPA (4). This occurs when you receive a grade of A+ in all incomplete subjects and improvement subjects.",
              },
            },
          ],
        },
      },
    });
  };

  useEffect(() => {
    if (planId) fetchPlanDetails(planId);
  }, [planId]);

  return { planDetails, loading, error };
};
