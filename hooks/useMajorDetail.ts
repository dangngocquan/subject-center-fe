import { useEffect, useState } from "react";

import { API_ROUTES } from "@/service/api-route.service";
import BaseRequest from "@/service/base-request.service";
import { Major } from "@/types/major";

export const useMajorDetail = (id: number) => {
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMajorDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const req = await new BaseRequest();
      req.setAuth();
      const response: { data: Major } = await req.get(
        API_ROUTES.GET_MAJOR_DETAIL(id),
        {},
      );
      setMajor(response.data);
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajorDetail();
  }, [major?.id]);

  return {
    major: major,
    loading,
    error,
    refetch: () => fetchMajorDetail(),
  };
};
