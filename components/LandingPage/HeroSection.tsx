"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react"; // Added useEffect

import { useAuthGoogle } from "@/service/auth.service";
import { siteConfig } from "@/config/site";
import GenericModal from "@/components/Common/GenericModal";
import { GenericButton } from "@/components/Common/GenericButton";
import LoadingModal from "@/components/LoadingModal";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

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
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined); // Add state for authToken

  // Function to update authToken from localStorage
  const updateAuthToken = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(token || undefined);
  };

  // Check token on mount and listen to authChange event
  useEffect(() => {
    updateAuthToken(); // Initial check
    window.addEventListener("authChange", updateAuthToken); // Listen to event
    return () => {
      window.removeEventListener("authChange", updateAuthToken); // Cleanup listener
    };
  }, []);

  const authGoogle = useAuthGoogle(
    () => {
      setIsLoading(false);
      setIsSignUpModalOpen(false);
    },
    () => setIsLoading(false),
  );

  return (
    <motion.section
      ref={heroRef}
      animate={isHeroInView ? "visible" : "hidden"}
      className="relative flex flex-col items-center justify-center gap-6 py-12 md:py-20 lg:py-32 text-center px-4 bg-cover bg-center"
      custom={0}
      initial="hidden"
      style={{
        backgroundImage: "url('/images/hero-background.jpg')",
        backgroundColor: "rgba(17, 24, 39, 0.3)",
      }}
      variants={fadeInVariants}
    >
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
        Manage your courses, track your grades, and plan your studies smartly.
      </motion.p>
      <motion.div
        className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
        custom={3}
        variants={fadeInVariants}
      >
        {/* Only show "Sign Up Now" if not logged in */}
        {!authToken && (
          <button
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
              className:
                "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/40 px-6 sm:px-8 py-2 text-white font-semibold",
            })}
            onClick={() => setIsSignUpModalOpen(true)}
          >
            Sign Up Now
          </button>
        )}
        <Link
          className={buttonStyles({
            variant: "bordered",
            radius: "full",
            size: "lg",
            className:
              "border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-300 px-6 sm:px-8 py-2 font-semibold",
          })}
          href={siteConfig.routers.majors}
        >
          Check Majors
        </Link>
      </motion.div>

      <GenericModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white p-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            Sign Up Now
          </h2>
          <p className="mb-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
            Create an account to manage your courses, track grades, and plan
            your studies effectively.
          </p>
          <GenericButton
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-600/60 transition-all duration-300"
            disabled={false}
            onClick={() => authGoogle()}
          >
            Sign Up with Google
          </GenericButton>
        </motion.div>
      </GenericModal>

      <LoadingModal isOpen={isLoading} onClose={() => setIsLoading(false)} />
    </motion.section>
  );
};

export default HeroSection;
