"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GenericButton } from "@/components/Common/GenericButton";
import { siteConfig } from "@/config/site";

// Component ImageFeatureCard
const ImageFeatureCard: React.FC<{
  aspect: "horizontal" | "vertical" | "square";
  desc: string;
  image: string;
}> = ({ aspect, desc, image }) => {
  return (
    <div
      className="flex flex-col items-center space-y-4 bg-gray-900/50 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 sm:p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 w-full max-w-[320px] mx-auto"
      style={{ height: "auto", minHeight: "320px" }}
    >
      <div className="relative w-full h-48 sm:h-56">
        <Image
          alt={desc}
          className="rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
          layout="fill"
          objectFit={
            aspect === "horizontal"
              ? "contain"
              : aspect === "vertical"
                ? "contain"
                : "cover"
          }
          quality={85}
          src={image}
        />
      </div>
      <p className="text-gray-300 font-light text-sm sm:text-base md:text-lg text-center leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef, {
    margin: "-100px",
    once: true,
  });

  interface FeatureItem {
    aspect: "horizontal" | "vertical" | "square";
    desc: string;
    image: string;
  }

  interface Feature {
    items: FeatureItem[];
    route: string;
    title: string;
  }

  const features: Feature[] = [
    {
      title: "Curriculum Visualization",
      route: `${siteConfig.routers.majors}`,
      items: [
        {
          aspect: "vertical",
          desc: "Subjects are clearly listed, helping students choose based on progress and interests.",
          image: "/images/f1_1.jpg",
        },
        {
          aspect: "horizontal",
          desc: "A prerequisite relationship graph aids in creating an efficient study plan.",
          image: "/images/f1_2.jpg",
        },
        {
          aspect: "horizontal",
          desc: "A dependency graph clearly shows subject prerequisites for effective planning.",
          image: "/images/f1_3.jpg",
        },
      ],
    },
    {
      title: "Personalized Study Planning",
      route: `${siteConfig.routers.plans}`,
      items: [
        {
          aspect: "vertical",
          desc: "A tailored list of subjects per semester based on your study plan.",
          image: "/images/f2_1.jpg",
        },
        {
          aspect: "square",
          desc: "A chart displaying current CPA to evaluate and set improvement goals.",
          image: "/images/f2_2.jpg",
        },
        {
          aspect: "square",
          desc: "Predicts minimum and maximum CPA based on current grades.",
          image: "/images/f2_3.jpg",
        },
        {
          aspect: "square",
          desc: "Adjusts CPA projections for grade improvements through retakes.",
          image: "/images/f2_4.jpg",
        },
        {
          aspect: "horizontal",
          desc: "A system dependency chart prioritizes subjects based on requirements.",
          image: "/images/f2_5.jpg",
        },
      ],
    },
    {
      title: "Grade Calculation",
      route: `${siteConfig.routers.lastTerm}`,
      items: [
        {
          aspect: "square",
          desc: "Calculates final exam scores needed for target grades from A+ to D.",
          image: "/images/f3_1.jpg",
        },
      ],
    },
    {
      title: "Timetable Generation",
      route: `${siteConfig.routers.timetable}`,
      items: [
        {
          aspect: "horizontal",
          desc: "Detailed semester timetable with subject info and CPA.",
          image: "/images/f4_1.jpg",
        },
        {
          aspect: "horizontal",
          desc: "Generates timetables showing completion status and requirements.",
          image: "/images/f4_2.jpg",
        },
      ],
    },
  ];

  const [startIndices, setStartIndices] = useState(features.map(() => 0));
  const touchStartX = useRef<number | null>(null);

  const handleNext = (featureIndex: number) => {
    setStartIndices((prev) =>
      prev.map((x, i) => (i === featureIndex ? x + 1 : x))
    );
  };

  const handlePrev = (featureIndex: number) => {
    setStartIndices((prev) =>
      prev.map((x, i) => (i === featureIndex ? x - 1 : x))
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (
    e: React.TouchEvent,
    featureIndex: number,
    k: number
  ) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      // Swipe threshold
      if (diff > 0)
        handleNext(featureIndex); // Swipe left -> next
      else handlePrev(featureIndex); // Swipe right -> prev
      touchStartX.current = null; // Reset after handling
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <motion.section
      animate={isFeaturesInView ? "visible" : "hidden"}
      className="py-8 md:py-16 lg:py-24 bg-transparent relative px-4"
      custom={0}
      initial="hidden"
      ref={featuresRef}
      variants={fadeInVariants}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl mx-auto relative z-10">
        <motion.h2
          animate={isFeaturesInView ? "visible" : "hidden"}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 md:mb-12 lg:mb-16 tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text No text-transparent"
          custom={1}
          variants={fadeInVariants}
        >
          Key <span className="text-cyan-400">Features</span>
        </motion.h2>

        <div className="space-y-12 md:space-y-16">
          {features.map((feature, i) => {
            const k = feature.items.length;
            const x = startIndices[i];
            const cardWidthWithSpace = 340;

            const displayedIndices = [
              ((x % k) + k) % k,
              (((x + 1) % k) + k) % k,
              (((x + 2) % k) + k) % k,
            ];

            return (
              <motion.div
                animate={isFeaturesInView ? "visible" : "hidden"}
                className="group bg-gray-900/80 rounded-2xl shadow-2xl shadow-cyan-500/20 p-6 md:p-8"
                custom={i + 2}
                key={i}
                variants={fadeInVariants}
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center py-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                  {feature.title}
                </h3>

                <div className="flex items-center justify-between w-full">
                  {k > 1 && (
                    <button
                      onClick={() => handlePrev(i)}
                      className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  <div
                    className="overflow-hidden w-full sm:w-[680px] md:w-[1020px]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => handleTouchMove(e, i, k)}
                    onTouchEnd={handleTouchEnd}
                  >
                    <motion.div
                      className="flex space-x-4"
                      animate={{
                        x: -(((x % k) + k) % k) * cardWidthWithSpace,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ width: k * cardWidthWithSpace }}
                    >
                      {feature.items.map((item, idx) => (
                        <div key={`${i}-${idx}`} className="flex-shrink-0">
                          <ImageFeatureCard
                            aspect={item.aspect}
                            desc={item.desc}
                            image={item.image}
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {k > 1 && (
                    <button
                      onClick={() => handleNext(i)}
                      className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex justify-center mt-6 md:mt-8">
                  <Link href={feature.route}>
                    <GenericButton
                      className="bg-gradient-to-r from-cyan-400 to-white text-gray-900 px-6 py-2 md:px-8 md:py-3 rounded-full font-extrabold shadow-md shadow-cyan-500/40 hover:shadow-cyan-500/50 transition-all duration-300"
                      tooltipContent={`Explore ${feature.title}`}
                      tooltipId={`explore-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Discover
                    </GenericButton>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
