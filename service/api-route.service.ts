export const API_ROUTES = {
  AUTH_GOOGLE: "/users/auth/google",
  PATCH_PLAN: (id: number) => `/plans/${id}`,
  POST_PLAN: "/plans",
  GET_PLANS: "/plans",
  GET_PLAN_DETAILS: (id: number) => `/plans/${id}/details`,
  DELETE_PLAN: (id: number) => `/plans/${id}`,
  GET_MAJORS: "/majors",
  GET_MAJOR_DETAIL: (id: number) => `/majors/${id}/detail`,
};
