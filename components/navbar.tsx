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
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Logo,
  LogoutIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { LOCAL_STORAGE_KEYS } from "@/config/localStorage";
import { siteConfig } from "@/config/site";
import { API_ROUTES } from "@/service/api-route.service";
import BaseRequest from "@/service/base-request.service";

export const Navbar = () => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);

  const authGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      new BaseRequest()
        .post(API_ROUTES.AUTH_GOOGLE, {
          token: tokenResponse,
        })
        .then((response) => {
          setAuthToken(response?.data?.token);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.AUTH_TOKEN,
            response?.data?.token,
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onError: (error) => {
      console.log(error);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      setAuthToken(token);
    }
  }, [authToken]);

  // Variants cho animation với hướng mới
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
      const angleStep = Math.PI / 2 / (3 - 1); // Tránh chia cho 0
      const angle = i * angleStep; // Góc cho mỗi button
      const x = -r * Math.cos(angle); // x giảm từ -radius đến 0
      const y = r * Math.sin(angle); // y tăng từ 0 đến radius
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

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
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
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex relative">
          {/* Main Button */}
          <Button
            className={authToken ? "text-success" : "default"}
            isIconOnly={!!authToken}
            startContent={<ProfileIcon style={{ userSelect: "none" }} />}
            variant="flat"
            onPress={() =>
              authToken ? setIsExpanded(!isExpanded) : authGoogle()
            }
          >
            {!authToken && "Guest"}
          </Button>

          {/* Expanded Buttons */}
          {authToken && (
            <div className="absolute z-10">
              <motion.div
                animate={isExpanded ? "visible" : "exit"}
                className="absolute"
                custom={0}
                initial="hidden"
                variants={buttonVariants}
              >
                <Button
                  isIconOnly
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  variant="flat"
                >
                  <ProfileIcon />
                </Button>
              </motion.div>

              <motion.div
                animate={isExpanded ? "visible" : "exit"}
                className="absolute"
                custom={1}
                initial="hidden"
                variants={buttonVariants}
              >
                <Button
                  isIconOnly
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  variant="flat"
                >
                  <SettingsIcon />
                </Button>
              </motion.div>

              <motion.div
                animate={isExpanded ? "visible" : "exit"}
                className="absolute"
                custom={2}
                initial="hidden"
                variants={buttonVariants}
              >
                <Button
                  isIconOnly
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                  variant="flat"
                  onPress={handleLogout}
                >
                  <LogoutIcon />
                </Button>
              </motion.div>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
