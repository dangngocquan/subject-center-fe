"use client";

import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import GenericModal from "./Common/GenericModal";
import {
  ArrowPointingInIcon,
  Logo,
  LogoutIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";
import { GenericButton } from "./Common/GenericButton";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";
import { useGoogleLogin } from "@react-oauth/google"; // Import for Google login
import { API_ROUTES } from "@/service/api-route.service"; // Import API routes
import BaseRequest from "@/service/base-request.service"; // Import BaseRequest

export const Navbar = () => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state for modal

  // Define authGoogle for Navbar's login functionality
  const authGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await new BaseRequest().post(API_ROUTES.AUTH_GOOGLE, {
          token: tokenResponse,
        });
        const token = response?.data?.token;
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token); // Save token to localStorage
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
        setIsLoading(false);
        setIsLoginModalOpen(false);

        // Dispatch custom event to notify successful sign-in
        window.dispatchEvent(new Event("authChange"));
      } catch (error) {
        console.error("Sign in error:", error);
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google sign in error:", error);
      setIsLoading(false);
    },
  });

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

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(undefined);
    setIsExpanded(false);
    window.dispatchEvent(new Event("authChange")); // Dispatch event on logout
  };

  const handlePlansClick = (e: React.MouseEvent) => {
    if (!authToken) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
    setIsMenuOpen(false);
  };

  const handleHamburgerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsExpanded(false);
    }
  };

  const navbarRef = useRef(null);
  const isInView = useInView(navbarRef, { once: true });

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    visible: (i: number) => {
      const r = 100;
      const totalButtons = 3;
      const angleStep = Math.PI / 2 / (totalButtons - 1);
      const angle = i * angleStep;
      const x = -r * Math.cos(angle);
      const y = r * Math.sin(angle);
      return {
        opacity: 1,
        scale: 1,
        x,
        y,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: i * 0.1,
        },
      };
    },
    exit: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: (2 - i) * 0.05,
      },
    }),
  };

  const mobileButtonVariants = {
    hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      y: (i + 1) * 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: i * 0.1,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: (2 - i) * 0.05,
      },
    }),
  };

  return (
    <>
      {/* Overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
          onKeyDown={handleOverlayKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Close expanded menu"
        />
      )}

      <motion.div
        ref={navbarRef}
        animate={isInView ? "visible" : "hidden"}
        initial="hidden"
        variants={navbarVariants}
        className="sticky top-0 z-50 w-full"
        style={{ position: "fixed", top: 0 }}
      >
        <HeroUINavbar
          className="bg-gray-900/80 backdrop-blur-md shadow-lg shadow-cyan-500/20 z-50 w-full"
          maxWidth="xl"
          position="sticky"
        >
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <button
              className="lg:hidden text-white mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={handleHamburgerKeyDown}
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink
                className="flex justify-start items-center gap-1"
                href="/"
              >
                <Logo />
                <p className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                  S-CENTER
                </p>
              </NextLink>
            </NavbarBrand>

            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "text-white hover:text-cyan-300 transition-colors data-[active=true]:text-cyan-400 data-[active=true]:font-medium"
                    )}
                    href={item.href}
                    onClick={
                      item.label === "Plans" ? handlePlansClick : undefined
                    }
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
            </ul>

            {isMenuOpen && (
              <div className="lg:hidden absolute top-14 left-0 w-full bg-gray-900/90 backdrop-blur-md z-40 flex flex-col items-start p-4">
                {siteConfig.navItems.map((item) => (
                  <NavbarItem key={item.href} className="w-full py-2">
                    <NextLink
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "text-white hover:text-cyan-300 transition-colors data-[active=true]:text-cyan-400 data-[active=true]:font-medium w-full block"
                      )}
                      href={item.href}
                      onClick={
                        item.label === "Plans"
                          ? handlePlansClick
                          : () => setIsMenuOpen(false)
                      }
                    >
                      {item.label}
                    </NextLink>
                  </NavbarItem>
                ))}
              </div>
            )}
          </NavbarContent>

          <NavbarContent
            className="sm:flex basis-1/5 sm:basis-full"
            justify="end"
          >
            <NavbarItem className="md:flex relative">
              <Tooltip
                content={
                  authToken ? (isExpanded ? "Exit" : "Expand") : "Sign In"
                }
              >
                <GenericButton
                  onClick={() => {
                    authToken
                      ? setIsExpanded(!isExpanded)
                      : setIsLoginModalOpen(true);
                  }}
                  disabled={false}
                  className={
                    authToken && isExpanded ? "bg-red-500 hover:bg-red-600" : ""
                  }
                >
                  {authToken ? (
                    isExpanded ? (
                      <ArrowPointingInIcon className="w-6 h-6" />
                    ) : (
                      <ProfileIcon className="w-6 h-6" />
                    )
                  ) : (
                    "Sign In"
                  )}
                </GenericButton>
              </Tooltip>

              {authToken && (
                <div className="absolute z-60">
                  <div className="hidden sm:block">
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={0}
                      initial="hidden"
                      variants={buttonVariants}
                    >
                      <Tooltip content="Profile">
                        <GenericButton>
                          <ProfileIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={1}
                      initial="hidden"
                      variants={buttonVariants}
                    >
                      <Tooltip content="Settings">
                        <GenericButton>
                          <SettingsIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={2}
                      initial="hidden"
                      variants={buttonVariants}
                    >
                      <Tooltip content="Logout">
                        <GenericButton
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <LogoutIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                  </div>

                  <div className="sm:hidden">
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={0}
                      initial="hidden"
                      variants={mobileButtonVariants}
                    >
                      <Tooltip content="Profile">
                        <GenericButton>
                          <ProfileIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={1}
                      initial="hidden"
                      variants={mobileButtonVariants}
                    >
                      <Tooltip content="Settings">
                        <GenericButton>
                          <SettingsIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={2}
                      initial="hidden"
                      variants={mobileButtonVariants}
                    >
                      <Tooltip content="Logout">
                        <GenericButton
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <LogoutIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                  </div>
                </div>
              )}
            </NavbarItem>
          </NavbarContent>
        </HeroUINavbar>
      </motion.div>

      {/* Login Modal */}
      <GenericModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center text-white p-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            Please Sign In
          </h2>
          <p className="mb-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
            You need to sign in to explore service plans and access all
            features.
          </p>
          <GenericButton
            onClick={() => authGoogle()} // Use the local authGoogle function
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-600/60 transition-all duration-300"
          >
            {isLoading ? "Signing In..." : "Sign In with Google"}
          </GenericButton>
        </motion.div>
      </GenericModal>
    </>
  );
};

export default Navbar;
