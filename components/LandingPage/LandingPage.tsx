"use client";

import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import DashboardSection from "./DashboardSection";

const LandingPage = () => {
  return (
    <main
      className="min-h-screen bg-cover bg-center text-gray-200 overflow-hidden font-sans"
      style={{
        backgroundImage: "url('/images/global-background.jpg')", // Hình nền chung cho toàn bộ trang
        backgroundColor: "rgba(17, 24, 39, 0.9)", // gray-900 với độ trong suốt cao hơn
      }}
    >
      {/* Gradient overlay tối hơn để giảm lớp màng sáng */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/85 z-0" /> */}

      <div className="relative z-10">
        <HeroSection />
        {/* <DashboardSection /> */}
        <FeaturesSection />
        <HowItWorksSection />
        {/* <TestimonialsSection /> */}
        <CTASection />
      </div>
    </main>
  );
};

export default LandingPage;
