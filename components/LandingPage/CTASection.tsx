"use client";

import { button as buttonStyles } from "@heroui/theme";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";
import GenericModal from "@/components/Common/GenericModal";
import { GenericButton } from "@/components/Common/GenericButton";
import { API_ROUTES } from "@/service/api-route.service";
import BaseRequest from "@/service/base-request.service";
import LoadingModal from "@/components/LoadingModal";

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
  const authGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await new BaseRequest().post(API_ROUTES.AUTH_GOOGLE, {
          token: tokenResponse.access_token,
        });
        const token = response?.data?.token;
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token); // Save token to localStorage
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
        setIsLoading(false);
        setIsLoginModalOpen(false);

        // Dispatch custom event to notify successful login
        window.dispatchEvent(new Event("authChange"));
      } catch (error) {
        console.error("Login error:", error);
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setIsLoading(false);
    },
  });

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
          {/* Only show "Log in with Google" if not logged in */}
          {!authToken && (
            <button
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
                className:
                  "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/40 px-8 md:px-10 py-3 md:py-4 text-lg md:text-xl text-white font-semibold",
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
          className="text-center text-white p-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            Log In Now
          </h2>
          <p className="mb-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
            Sign in to access all the amazing features of S-CENTER.
          </p>
          <GenericButton
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-600/60 transition-all duration-300"
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
