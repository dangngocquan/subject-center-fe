import { API_ROUTES } from "./api-route.service";
import BaseRequest from "./base-request.service";

import { Plan, PlanResultUpsert } from "@/types/plan";

export const apiUpsertPlan = async (
  plan: Plan,
): Promise<{
  isBadRequest: boolean;
  message: string;
  data?: PlanResultUpsert;
  status: number;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    data?: PlanResultUpsert;
    status: number;
  } = {
    isBadRequest: false,
    message: "",
    data: undefined,
    status: 200,
  };
  const req = new BaseRequest();
  req.setAuth();
  await req
    .patch(API_ROUTES.PATCH_PLAN(Number(plan.id)), {
      name: plan.name,
      items: plan.items?.map((item) => ({
        name: item.name,
        code: item.code,
        credit: item.credit,
        prerequisites: item.prerequisites,
      })),
    })
    .then((res) => {
      result.status = res.status;
      result.data = res.data.data;
      result.isBadRequest = res.status > 300;
      result.message = res.data.message;
    });
  return result;
};

export const createNewPlan = async (
  plan: Plan,
): Promise<{
  isBadRequest: boolean;
  message: string;
  data: PlanResultUpsert | undefined;
  status: number;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    data: PlanResultUpsert | undefined;
    status: number;
  } = {
    isBadRequest: false,
    message: "",
    data: undefined,
    status: 200,
  };
  const req = new BaseRequest();
  req.setAuth();
  await req
    .post(API_ROUTES.POST_PLAN, {
      name: plan.name,
      items: plan.items?.map((item) => ({
        name: item.name,
        code: item.code,
        credit: item.credit,
        prerequisites: item.prerequisites,
      })),
    })
    .then((res) => {
      result.status = res.status;
      result.data = res.data;
      result.isBadRequest = res.status > 300;
      result.message = res.message;
    });
  return result;
};

export const deletePlan = async (
  planId: number,
): Promise<{
  isBadRequest: boolean;
  message: string;
  status: number;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    status: number;
  } = {
    isBadRequest: false,
    message: "",
    status: 200,
  };
  const req = new BaseRequest();
  req.setAuth();
  await req.delete(API_ROUTES.DELETE_PLAN(planId)).then((res) => {
    result.status = res.status;
    result.isBadRequest = res.status > 300;
    result.message = res.data.message;
  });
  return result;
};
