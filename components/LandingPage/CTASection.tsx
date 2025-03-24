"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/config/site";

const CTASection = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ctaRef}
      animate={isCtaInView ? "visible" : "hidden"}
      className="py-16 md:py-24 relative px-4"
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 text-center text-white">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent drop-shadow-lg"
          custom={1}
          variants={fadeInVariants}
        >
          Ready to <span className="text-cyan-400">get started</span>?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl font-light max-w-xl text-gray-200 tracking-wide"
          custom={2}
          variants={fadeInVariants}
        >
          Log in now to explore the amazing features of S-CENTER.
        </motion.p>
        <motion.div custom={3} variants={fadeInVariants}>
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
              className:
                "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/40 px-8 md:px-10 py-3 md:py-4 text-lg md:text-xl text-white font-semibold",
            })}
            href={siteConfig.links.googleLogin}
          >
            Log in with Google
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection;
