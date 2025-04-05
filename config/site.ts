export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Center",
  description: "View your schedule, grades, and GPA in an intuitive, easy-to-manage interface",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    {
      label: "Majors",
      href: `${"/majors"}`,
    },
    {
      label: "Plans",
      href: "/plans",
    },
    {
      label: "Last Term Calculator",
      href: "/last-term",
    },
    {
      label: "Timetable Validator",
      href: "/timetable",
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
