import { API_ROUTES } from "./api-route.service";
import BaseRequest from "./base-request.service";

import {
  Plan,
  PlanItem,
  PlanResultUpsert,
  ResponseImportUpdateGradePlan,
  ResponsePlanUpsert,
} from "@/types/plan";

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

export const updatePlanItem = async (
  planId: number,
  item: PlanItem,
): Promise<{
  isBadRequest: boolean;
  message: string;
  status: number;
  data?: PlanItem;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    status: number;
    data?: PlanItem;
  } = {
    isBadRequest: false,
    message: "",
    status: 200,
    data: undefined,
  };
  const req = new BaseRequest();
  req.setAuth();
  await req
    .patch(API_ROUTES.PATCH_PLAN_ITEM(planId), {
      id: item.id,
      name: item.name,
      code: item.code,
      credit: Number(item.credit),
      prerequisites: item.prerequisites,
      gradeLatin: item.gradeLatin ?? null,
    })
    .then((res) => {
      result.status = res.status;
      result.isBadRequest = res.status > 300;
      result.message = res.data.message;
      result.data = res.data;
    });
  return result;
};

export const updateGradePlanItemByJson = async (
  planId: number,
  file: File,
): Promise<{
  isBadRequest: boolean;
  message: string;
  status: number;
  data: ResponseImportUpdateGradePlan;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    status: number;
    data: ResponseImportUpdateGradePlan;
  } = {
    isBadRequest: false,
    message: "",
    status: 200,
    data: { result: [], items: [] },
  };

  const formData = new FormData();
  formData.append("file", file);

  const req = new BaseRequest();
  req.setAuth();
  req.setHeader("Content-Type", "multipart/form-data");
  await req
    .patch(API_ROUTES.PATCH_PLAN_ITEM_GRADE_JSON(planId), formData)
    .then((res) => {
      result.status = res.status;
      result.isBadRequest = res.status > 300;
      result.message = res.data.message;
      result.data = res.data;
    })
    .catch((error) => {
      result.isBadRequest = true;
      result.message = error.message;
    });

  return result;
};

export const deletePlanItem = async (
  planId: number,
  itemId: number,
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
  await req.delete(API_ROUTES.DELETE_PLAN_ITEM(planId, itemId)).then((res) => {
    result.status = res.status;
    result.isBadRequest = res.status > 300;
    result.message = res.data.message;
  });

  return result;
};

export const createPlanByImportJSON = async (
  file: File,
): Promise<{
  isBadRequest: boolean;
  message: string;
  status: number;
  data?: ResponsePlanUpsert;
}> => {
  const result: {
    isBadRequest: boolean;
    message: string;
    status: number;
    data?: ResponsePlanUpsert;
  } = {
    isBadRequest: false,
    message: "",
    status: 200,
    data: undefined,
  };

  const formData = new FormData();
  formData.append("file", file);

  const req = new BaseRequest();
  req.setAuth();
  req.setHeader("Content-Type", "multipart/form-data");
  await req
    .post(API_ROUTES.POST_PLAN_BY_JSON, formData)
    .then((res) => {
      result.status = res.status;
      result.isBadRequest = res.status > 300;
      result.message = res.data.message;
      result.data = res.data; // Assign the response data to the result
    })
    .catch((error) => {
      result.isBadRequest = true;
      result.message = error.message;
    });
  console.log(result);
  return result;
};
