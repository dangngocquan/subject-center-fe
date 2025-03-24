"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DashboardSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const dashboardRef = useRef(null);
  const isDashboardInView = useInView(dashboardRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.section
      ref={dashboardRef}
      animate={isDashboardInView ? "visible" : "hidden"}
      className="py-16 md:py-24 bg-transparent relative px-4" // Thay bg-gray-900 thành bg-transparent
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl mx-auto relative z-10 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent"
          custom={1}
          variants={fadeInVariants}
        >
          Smart <span className="text-cyan-400">Interface</span>
        </motion.h2>
        <motion.div
          className="relative bg-gray-900/80 p-6 md:p-8 rounded-2xl shadow-2xl  shadow-cyan-500/20"
          custom={2}
          variants={fadeInVariants}
        >
          <img
            alt="Smart interface preview"
            className="w-full max-w-xs sm:max-w-md md:max-w-4xl mx-auto rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
            src="/images/dashboard-preview.jpg"
          />
          <motion.p
            className="mt-4 md:mt-6 text-gray-300 font-light text-base sm:text-lg"
            custom={3}
            variants={fadeInVariants}
          >
            View your schedule, grades, and GPA in an intuitive, easy-to-manage
            interface.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DashboardSection;
