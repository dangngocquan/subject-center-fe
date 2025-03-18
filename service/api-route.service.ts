export const API_ROUTES = {
  AUTH_GOOGLE: "/users/auth/google",
  GET_PLANS: "/plans",
  GET_PLAN_SUMMARY: (id: number) => `/plans/${id}/summary/subject`,
};
