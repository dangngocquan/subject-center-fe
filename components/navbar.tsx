"use client";

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
import { useRouter } from "next/navigation";

import GenericModal from "./Common/GenericModal";
import { GenericButton } from "./Common/GenericButton";

import { useAuthGoogle } from "@/service/auth.service";
import {
  ArrowPointingInIcon,
  Logo,
  LogoutIcon,
  ProfileIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";

export const Navbar = () => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authGoogle = useAuthGoogle(
    () => {
      setIsLoading(false);
      setIsLoginModalOpen(false);
    },
    () => setIsLoading(false)
  );

  const updateAuthToken = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(token || undefined);
  };

  useEffect(() => {
    updateAuthToken();
    window.addEventListener("authChange", updateAuthToken);
    return () => {
      window.removeEventListener("authChange", updateAuthToken);
    };
  }, []);

  // Ngăn cuộn trên body khi menu mở
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
        setIsMenuVisible(false);
      }, 400); // Tăng thời gian để khớp với duration mới
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(undefined);
    setIsExpanded(false);
    window.dispatchEvent(new Event("authChange"));
    router.push(`${siteConfig.routers.home}`);
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

  const handleMenuOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsMenuOpen(false);
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

  // Animation cho các mục menu
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // Custom easing cho cảm giác mượt mà
        delay: i * 0.1,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        delay: (siteConfig.navItems.length - 1 - i) * 0.05,
      },
    }),
  };

  return (
    <>
      {/* Overlay khi menu mở trên mobile */}
      {isMenuVisible && (
        <div
          aria-label="Close menu"
          className={`fixed inset-0 bg-black/70 z-40 lg:hidden cursor-pointer transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          role="button"
          tabIndex={0}
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={handleMenuOverlayKeyDown}
        />
      )}

      {/* Overlay khi expanded (cho profile menu) */}
      {isExpanded && (
        <div
          aria-label="Close expanded menu"
          className="fixed inset-0 bg-black/50 z-40"
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(false)}
          onKeyDown={handleOverlayKeyDown}
        />
      )}

      <motion.div
        ref={navbarRef}
        animate={isInView ? "visible" : "hidden"}
        className="sticky top-0 z-50 w-full"
        initial="hidden"
        style={{ position: "fixed", top: 0 }}
        variants={navbarVariants}
      >
        <HeroUINavbar
          className="bg-gray-900/80 backdrop-blur-md shadow-lg shadow-cyan-500/20 z-50 w-full"
          maxWidth="xl"
          position="sticky"
        >
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <button
              aria-label="Toggle menu"
              className="lg:hidden text-white mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={handleHamburgerKeyDown}
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

            {isMenuVisible && (
              <div
                className={`lg:hidden fixed top-0 left-0 w-4/5 max-w-xs h-screen bg-gray-900/90 backdrop-blur-md z-50 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex items-center p-4 border-b border-gray-800/50">
                  <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                      className="flex justify-start items-center gap-1"
                      href="/"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Logo />
                      <p className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                        S-CENTER
                      </p>
                    </NextLink>
                  </NavbarBrand>
                </div>
                <ul className="flex flex-col p-4">
                  {siteConfig.navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      animate={isMenuOpen ? "visible" : "exit"}
                      className="w-full py-2"
                      custom={index}
                      initial="hidden"
                      variants={menuItemVariants}
                    >
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
                    </motion.li>
                  ))}
                </ul>
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
                  className={
                    authToken && isExpanded ? "bg-red-500 hover:bg-red-600" : ""
                  }
                  disabled={false}
                  onClick={() => {
                    authToken
                      ? setIsExpanded(!isExpanded)
                      : setIsLoginModalOpen(true);
                  }}
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
                    {/* <motion.div
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
                    </motion.div> */}
                    {/* <motion.div
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
                    </motion.div> */}
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={2}
                      initial="hidden"
                      variants={buttonVariants}
                    >
                      <Tooltip content="Logout">
                        <GenericButton
                          className="bg-red-500 hover:bg-red-600"
                          onClick={handleLogout}
                        >
                          <LogoutIcon className="w-6 h-6" />
                        </GenericButton>
                      </Tooltip>
                    </motion.div>
                  </div>

                  <div className="sm:hidden">
                    {/* <motion.div
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
                    </motion.div> */}
                    {/* <motion.div
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
                    </motion.div> */}
                    <motion.div
                      animate={isExpanded ? "visible" : "exit"}
                      className="absolute"
                      custom={0}
                      initial="hidden"
                      variants={mobileButtonVariants}
                    >
                      <Tooltip content="Logout">
                        <GenericButton
                          className="bg-red-500 hover:bg-red-600"
                          onClick={handleLogout}
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
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white p-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            Please Sign In
          </h2>
          <p className="mb-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
            You need to sign in to explore service plans and access all
            features.
          </p>
          <GenericButton
            className="bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-600/60 transition-all duration-300"
            disabled={isLoading}
            onClick={() => authGoogle()}
          >
            {isLoading ? "Signing In..." : "Sign In with Google"}
          </GenericButton>
        </motion.div>
      </GenericModal>
    </>
  );
};

export default Navbar;
