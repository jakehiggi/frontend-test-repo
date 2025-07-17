import Navigation from "@/components/landing/Header";
import ProfessionalHero from "@/components/landing/ProfessionalHero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ProfessionalHero />
      <FeaturesSection />
      <Footer />
    </div>
  );
}