"use client";

import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { useGoogleLogin } from "@react-oauth/google";
import clsx from "clsx";
import { motion, useInView } from "framer-motion"; // Thêm useInView
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@nextui-org/react";

import {
  ArrowPointingInIcon,
  Logo,
  LogoutIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/components/icons";
import LoadingModal from "@/components/LoadingModal";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";
import { siteConfig } from "@/config/site";
import { API_ROUTES } from "@/service/api-route.service";
import BaseRequest from "@/service/base-request.service";

export const Navbar = () => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await new BaseRequest().post(API_ROUTES.AUTH_GOOGLE, {
          token: tokenResponse,
        });

        setAuthToken(response?.data?.token);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.AUTH_TOKEN,
          response?.data?.token,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay để test
        setIsLoading(false);
      } catch (error) {
        console.error("Login error:", error);
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      setAuthToken(token);
    }
  }, [authToken]);

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.2,
      },
    },
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

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    setAuthToken(undefined);
    setIsExpanded(false);
  };

  // Ref để theo dõi khi Navbar vào viewport
  const navbarRef = useRef(null);
  const isInView = useInView(navbarRef, { once: true }); // Chỉ trigger một lần

  // Animation cho Navbar
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <motion.div
        ref={navbarRef}
        animate={isInView ? "visible" : "hidden"}
        initial="hidden"
        variants={navbarVariants}
      >
        <HeroUINavbar className="mt-8" maxWidth="xl" position="sticky">
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink
                className="flex justify-start items-center gap-1"
                href="/"
              >
                <Logo />
                <p className="font-bold text-inherit">ACME</p>
              </NextLink>
            </NavbarBrand>
            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
            </ul>
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
                <Button
                  className={
                    authToken
                      ? isExpanded
                        ? "text-danger"
                        : "text-success"
                      : "default"
                  }
                  isIconOnly={!!authToken}
                  startContent={
                    isExpanded ? <ArrowPointingInIcon /> : <ProfileIcon />
                  }
                  variant="flat"
                  onPress={() => {
                    authToken ? setIsExpanded(!isExpanded) : authGoogle();
                  }}
                >
                  {!authToken && "Guest"}
                </Button>
              </Tooltip>

              {authToken && (
                <div className="absolute z-10">
                  <motion.div
                    animate={isExpanded ? "visible" : "exit"}
                    className="absolute"
                    custom={0}
                    initial="hidden"
                    variants={buttonVariants}
                  >
                    <Tooltip content="Profile">
                      <Button
                        isIconOnly
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                        variant="flat"
                      >
                        <ProfileIcon />
                      </Button>
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
                      <Button
                        isIconOnly
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                        variant="flat"
                      >
                        <SettingsIcon />
                      </Button>
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
                      <Button
                        isIconOnly
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                        variant="flat"
                        onPress={handleLogout}
                      >
                        <LogoutIcon />
                      </Button>
                    </Tooltip>
                  </motion.div>
                </div>
              )}
            </NavbarItem>
          </NavbarContent>
        </HeroUINavbar>
      </motion.div>

      <LoadingModal isOpen={isLoading} onClose={() => setIsLoading(false)} />
    </>
  );
};
