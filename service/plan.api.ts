import { Plan } from "@/types/plan";
import BaseRequest from "./base-request.service";
import { API_ROUTES } from "./api-route.service";

export const apiUpsertPlan = async (plan: Plan) => {
  const req = new BaseRequest();
  req.setAuth();
  return req
    .patch(API_ROUTES.CREATE_PLAN, {
      name: plan.name,
      items: plan.items?.map((item) => ({
        name: item.name,
        code: item.code,
        credit: item.credit,
        prerequisites: item.prerequisites,
      })),
    })
    .then((res) => {
      return res.data as {
        plan: Plan;
        successes: {
          code: string;
          message: string;
        }[];
        failed: {
          code: string;
          message: string;
        }[];
      };
    });
};
