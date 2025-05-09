"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const HowItWorksSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const howItWorksRef = useRef(null);
  const isHowItWorksInView = useInView(howItWorksRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.section
      ref={howItWorksRef}
      animate={isHowItWorksInView ? "visible" : "hidden"}
      className="py-16 md:py-24 bg-transparent relative px-4"
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl mx-auto relative z-10 text-center">
        {/* Tiêu đề riêng, giống với DashboardSection */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 tracking-tight bg-gradient-to-r from-color-15 to-color-5 bg-clip-text text-transparent"
          custom={1}
          variants={fadeInVariants}
        >
          How does S-CENTER work?
        </motion.h2>

        {/* Khối nội dung "nổi" lên */}
        <motion.div
          className="relative bg-color-1/80 p-6 md:p-8 rounded-2xl shadow-lg shadow-color-15/20"
          custom={2}
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                step: "Log in",
                desc: "Use your Google account to get started.",
                img: "/images/step1.jpg",
              },
              {
                step: "Create a plan",
                desc: "Set up a personalized study plan.",
                img: "/images/step2.jpg",
              },
              {
                step: "Track progress",
                desc: "Check your scores and progress.",
                img: "/images/step3.jpg",
              },
              {
                step: "Explore fields of study",
                desc: "Discover the field of study that suits you.",
                img: "/images/step4.jpg",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-6 text-center bg-color-1/30 backdrop-blur-md rounded-xl border border-color-15 hover:bg-color-6/50 hover:shadow-xl hover:shadow-color-15/20 transition-all duration-500"
                custom={i + 2}
                variants={fadeInVariants}
              >
                <img
                  alt={item.step}
                  className="w-24 h-24 mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  src={item.img}
                />
                <h3 className="text-lg font-semibold text-color-15">
                  {item.step}
                </h3>
                <p className="text-color-15 font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
