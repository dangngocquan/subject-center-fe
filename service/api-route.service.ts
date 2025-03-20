export const API_ROUTES = {
  AUTH_GOOGLE: "/users/auth/google",
  CREATE_PLAN: "/plans",
  GET_PLANS: "/plans",
  GET_PLAN_SUMMARY: (id: number) => `/plans/${id}/summary/subject`,
  GET_MAJORS: "/majors",
  GET_MAJOR_DETAIL: (id: number) => `/majors/${id}/detail`,
};
