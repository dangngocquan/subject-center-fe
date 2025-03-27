import { useState, useEffect } from "react";

import { Credits } from "../types/plan";

import BaseRequest from "@/service/base-request.service";
import { API_ROUTES } from "@/service/api-route.service";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

export const usePlans = (searchQuery: string) => {
  const [plans, setPlans] = useState<
    { id: string; name: string; createdAt: string; summary: Credits }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const req = await new BaseRequest();
      req.setAuth();
      const response: {
        data: {
          id: string;
          name: string;
          createdAt: string;
          summary: {
            data: Credits;
          };
        }[];
      } = await req.get(API_ROUTES.GET_PLANS, {
        headers: {
          token: `${localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)}`,
        },
        query: { name: query },
      });
      const array = (response.data || []).map((plan) => ({
        ...plan,
        summary: plan.summary.data,
      }));
      setPlans(array);
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(searchQuery);
  }, [searchQuery]);

  return { plans, loading, error, refetch: () => fetchPlans(searchQuery) };
};
