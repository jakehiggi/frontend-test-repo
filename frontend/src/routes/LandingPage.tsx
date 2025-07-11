import Navigation from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

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
