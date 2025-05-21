"use client";

import { button as buttonStyles } from "@heroui/theme";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";
import GenericModal from "@/components/Common/GenericModal";
import GenericButton from "@/components/Common/GenericButton";
import LoadingModal from "@/components/LoadingModal";
import { useAuthGoogle } from "@/service/auth.service";

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
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal
  const [isLoading, setIsLoading] = useState(false); // State for loading

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

  // Google login handler
  const authGoogle = useAuthGoogle(
    () => {
      setIsLoading(false);
      setIsLoginModalOpen(false);
    },
    () => setIsLoading(false)
  );

  return (
    <motion.section
      ref={ctaRef}
      animate={isCtaInView ? "visible" : "hidden"}
      className="py-16 md:py-24 relative px-4"
      custom={0}
      initial="hidden"
      variants={fadeInVariants}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 text-center text-color-15">
        <motion.h2
          className="pb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-color-15 to-color-5 bg-clip-text text-transparent drop-shadow-lg"
          custom={1}
          variants={fadeInVariants}
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl font-light max-w-xl text-color-15 tracking-wide"
          custom={2}
          variants={fadeInVariants}
        >
          Log in now to explore the amazing features of S-CENTER.
        </motion.p>
        <motion.div custom={3} variants={fadeInVariants}>
          {/* Only show "Log in with Google" if not logged in */}
          {!authToken && (
            <button
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
                className:
                  "bg-color-3 hover:bg-color-6 hover:scale-105 transition-all duration-300 shadow-lg shadow-color-15/40 px-8 md:px-10 py-3 md:py-4 text-lg md:text-xl text-color-15 font-semibold",
              })}
              onClick={() => setIsLoginModalOpen(true)} // Open modal on click
            >
              Log in with Google
            </button>
          )}
        </motion.div>
      </div>

      {/* Login Modal */}
      <GenericModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-color-15 p-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-color-15 to-color-5 bg-clip-text text-transparent">
            Log In Now
          </h2>
          <p className="mb-6 text-color-15 text-base md:text-lg leading-relaxed max-w-full mx-auto">
            Sign in to access all the amazing features of S-CENTER.
          </p>
          <GenericButton
            className="bg-gradient-to-r from-color-3 to-color-6 hover:from-color-6 hover:to-color-9 text-color-15 px-6 py-3 rounded-full font-semibold shadow-lg shadow-color-15/50 hover:shadow-color-15/60 transition-all duration-300"
            disabled={isLoading}
            onClick={() => authGoogle()}
          >
            {isLoading ? "Logging In..." : "Log In with Google"}
          </GenericButton>
        </motion.div>
      </GenericModal>

      {/* Loading Modal */}
      <LoadingModal isOpen={isLoading} onClose={() => setIsLoading(false)} />
    </motion.section>
  );
};

export default CTASection;
