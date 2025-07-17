import Navigation from "@/components/landing/Header";
import CompleteLandingPage from "@/components/landing/CompleteLandingPage";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CompleteLandingPage />
      <Footer />
    </div>
  );
}