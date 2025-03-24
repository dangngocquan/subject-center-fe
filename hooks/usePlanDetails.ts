import { useState, useEffect } from "react";

import { PlanDetails } from "../types/plan";

import BaseRequest from "@/service/base-request.service";
import { API_ROUTES } from "@/service/api-route.service";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

export const usePlanDetails = (
  planId: string | null | undefined,
  refreshTrigger: number = 0 // Thêm tham số trigger
) => {
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const req = await new BaseRequest();
      req.setAuth();
      const response: { data: PlanDetails } = await req.get(
        API_ROUTES.GET_PLAN_DETAILS(Number(id)),
        {
          headers: {
            token: `${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
          },
        }
      );
      setPlanDetails(response.data);
    } catch (err) {
      setError("Failed to fetch plan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlanDetails(planId);
    }
  }, [planId, refreshTrigger]); // Thêm refreshTrigger vào dependencies

  return { planDetails, loading, error };
};
