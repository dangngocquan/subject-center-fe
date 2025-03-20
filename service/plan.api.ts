import { Plan } from "@/types/plan";
import { API_ROUTES } from "./api-route.service";
import BaseRequest from "./base-request.service";

export const apiUpsertPlan = async (
  plan: Plan
): Promise<{
  isBadRequest: boolean;
  message: string;
  data: {
    plan: Plan;
    result: {
      name: string;
      code: string;
      status: "SUCCEEDED" | "FAILED";
      message: string;
    }[];
  };
  status: number;
}> => {
  const req = new BaseRequest();
  req.setAuth();

  const response = await req.patch(API_ROUTES.CREATE_PLAN, {
    name: plan.name,
    items: plan.items?.map((item) => ({
      name: item.name,
      code: item.code,
      credit: item.credit,
      prerequisites: item.prerequisites,
    })),
  });
  return response.data;
};
