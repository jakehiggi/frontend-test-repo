"use client";

import Navigation from "@/src/ui/components/Navigation";
import HeroCarousel from "@/src/ui/components/HeroCarousel";
import FeaturesSection from "@/src/ui/components/FeaturesSection";
import Footer from "@/src/ui/components/Footer";

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
