import Navigation from "@/components/landing/Header";
import HeroCarousel from "@/components/landing/HeroCarousel";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroCarousel />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
