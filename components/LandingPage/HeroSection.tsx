"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/config/site";

const HeroSection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={heroRef}
      animate={isHeroInView ? "visible" : "hidden"}
      className="relative flex flex-col items-center justify-center gap-6 py-12 md:py-20 lg:py-32 text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero-background.jpg')", // Hình nền bàn học sang trọng
        backgroundColor: "rgba(17, 24, 39, 0.3)", // Giảm độ trong suốt từ 0.5 xuống 0.3
      }}
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      {/* Gradient overlay với độ trong suốt thấp hơn để hình nền rõ hơn */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/60 to-gray-900/50 z-0" />

      <motion.h1
        className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent drop-shadow-lg"
        custom={1}
        variants={fadeInVariants}
      >
        Optimize Your <span className="text-cyan-400">University Journey</span>
      </motion.h1>
      <motion.p
        className="relative z-10 text-lg sm:text-xl md:text-2xl max-w-xl md:max-w-3xl font-light text-gray-200 tracking-wide"
        custom={2}
        variants={fadeInVariants}
      >
        Manage your courses, track your grades, and plan your studies smartly
        with AI technology.
      </motion.p>
      <motion.div
        className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
        custom={3}
        variants={fadeInVariants}
      >
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
            size: "lg",
            className:
              "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/40 px-6 sm:px-8 py-2 text-white font-semibold",
          })}
          href={siteConfig.links.register}
        >
          Sign Up Now
        </Link>
        <Link
          className={buttonStyles({
            variant: "bordered",
            radius: "full",
            size: "lg",
            className:
              "border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-300 px-6 sm:px-8 py-2 font-semibold",
          })}
          href={siteConfig.links.docs}
        >
          Learn More
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
