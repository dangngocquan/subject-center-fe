export const API_ROUTES = {
  AUTH_GOOGLE: "/users/auth/google",
  PATCH_PLAN: (id: number) => `/plans/${id}`,
  POST_PLAN: "/plans",
  GET_PLANS: "/plans",
  POST_PLAN_BY_JSON: "/plans/import/json",
  GET_PLAN_DETAILS: (id: number) => `/plans/${id}/details`,
  DELETE_PLAN: (id: number) => `/plans/${id}`,
  DELETE_PLAN_ITEM: (id: number, itemId: number) =>
    `/plans/${id}/items/${itemId}`,
  PATCH_PLAN_ITEM: (id: number) => `/plans/${id}/item`,
  PATCH_PLAN_ITEM_GRADE_JSON: (id: number) => `/plans/${id}/items/json`,
  GET_MAJORS: "/majors",
  GET_MAJOR_DETAIL: (id: number) => `/majors/${id}/detail`,
};
