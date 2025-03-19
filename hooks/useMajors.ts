import { useState, useEffect } from "react";
import BaseRequest from "@/service/base-request.service";
import { API_ROUTES } from "@/service/api-route.service";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

export const useMajors = (searchQuery: string) => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMajors = async (query: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const req = await new BaseRequest();
      req.setAuth();
      console.log("bbb");
      const response: { data: { data: Major[] } } = await req.get(
        API_ROUTES.GET_MAJORS,
        {
          query: { name: query },
        }
      );
      setMajors(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors(searchQuery);
  }, [searchQuery]);

  return {
    majors: majors,
    loading,
    error,
    refetch: () => fetchMajors(searchQuery),
  };
};
