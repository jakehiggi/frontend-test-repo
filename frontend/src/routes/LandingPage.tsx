import Navigation from "@/components/landing/Header";
import CompleteLandingPage from "@/components/landing/CompleteLandingPage";
import Footer from "@/components/landing/Footer";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // Handle hash navigation on page load
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash) {
        // Wait a moment for the page to fully load
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    // Handle initial hash navigation
    handleHashNavigation();

    // Handle hash changes (for browser back/forward navigation)
    const handleHashChange = () => {
      handleHashNavigation();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CompleteLandingPage />
      <Footer />
    </div>
  );
}