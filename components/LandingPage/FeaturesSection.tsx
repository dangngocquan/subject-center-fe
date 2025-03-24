"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FeaturesSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.section
      ref={featuresRef}
      animate={isFeaturesInView ? "visible" : "hidden"}
      className="py-16 md:py-24 bg-transparent relative px-4"
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl mx-auto relative z-10 text-center">
        {/* Tiêu đề riêng, giống với DashboardSection */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent"
          custom={1}
          variants={fadeInVariants}
        >
          <span className="text-cyan-400">Outstanding</span> Features
        </motion.h2>

        {/* Khối nội dung "nổi" lên */}
        <motion.div
          className="relative bg-gray-900/80 p-6 md:p-8 rounded-2xl shadow-lg shadow-cyan-500/20"
          custom={2}
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Study Plan Management",
                desc: "Set up personalized study plans.",
                icon: "/images/plan-icon.jpg",
              },
              {
                title: "Score Tracking",
                desc: "View scores and study progress.",
                icon: "/images/score-icon.jpg",
              },
              {
                title: "Field of Study Management",
                desc: "Explore and choose suitable fields of study.",
                icon: "/images/major-icon.jpg",
              },
              {
                title: "User-Friendly Interface",
                desc: "Easy to use on all devices.",
                icon: "/images/ui-icon.jpg",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-6 bg-gray-900/30 backdrop-blur-md rounded-xl border border-cyan-500/20 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500"
                custom={i + 2}
                variants={fadeInVariants}
              >
                <img
                  alt={feature.title}
                  className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  src={feature.icon}
                />
                <h3 className="text-xl font-semibold mb-2 text-cyan-400">
                  {feature.title}
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.img
            alt="App interface screenshot"
            className="mt-12 w-full max-w-4xl mx-auto rounded-lg shadow-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
            custom={6}
            src="/images/app-screenshot.jpg"
            variants={fadeInVariants}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
