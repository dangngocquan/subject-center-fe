export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Center",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Majors",
      href: `${"/majors"}`,
    },
    {
      label: "Plans",
      href: "/plans",
    },
  ],
  routers: {
    home: "/",
    majors: "/majors",
    majorDetails: (id: string) => `/majors/${id}`,
    plans: "/plans",
    planDetails: (id: string) => `/plans/${id}`,
  },
};
