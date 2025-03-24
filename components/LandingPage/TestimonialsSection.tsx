"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TestimonialsSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.section
      ref={testimonialsRef}
      animate={isTestimonialsInView ? "visible" : "hidden"}
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
          What do users say about{" "}
          <span className="text-cyan-400">S-CENTER</span>?
        </motion.h2>

        {/* Khối nội dung "nổi" lên */}
        <motion.div
          className="relative bg-gray-900/80 p-6 md:p-8 rounded-2xl shadow-lg shadow-cyan-500/20"
          custom={2}
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyen Anh",
                text: "S-CENTER helps me manage my time more effectively!",
                avatar: "/images/user1.jpg",
              },
              {
                name: "Le Minh",
                text: "Beautiful interface, easy to use, very suitable for students.",
                avatar: "/images/user2.jpg",
              },
              {
                name: "Tran Ngoc",
                text: "I found my favorite field of study thanks to this app.",
                avatar: "/images/user3.jpg",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="group p-6 bg-gray-900/30 backdrop-blur-md rounded-xl border border-cyan-500/20 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500"
                custom={i + 2}
                variants={fadeInVariants}
              >
                <img
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  src={testimonial.avatar}
                />
                <p className="text-gray-300 italic mb-2 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <p className="text-cyan-400 font-semibold">
                  {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
