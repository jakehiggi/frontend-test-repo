"use client";

import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <HeroCarousel />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
