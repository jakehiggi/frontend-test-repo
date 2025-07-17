import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleNavigation = (sectionId: string) => {
  const currentPath = window.location.pathname;
  
  // If we're not on the landing page, navigate to landing page first
  if (currentPath !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }
  
  // If we're on the landing page, scroll to the section
  scrollToSection(sectionId);
};

export default function Navigation() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-xl font-bold text-foreground">
              LEVARE AI
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {isLandingPage ? (
              // If on landing page, use scroll functionality
              <>
                <button 
                  onClick={() => scrollToSection('what-levare-does')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  What Levare AI Does
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  About Levare AI
                </button>
                <button 
                  onClick={() => scrollToSection('team')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Meet the Team
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Contact
                </button>
              </>
            ) : (
              // If on other pages, navigate to landing page with hash
              <>
                <button 
                  onClick={() => handleNavigation('what-levare-does')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  What Levare AI Does
                </button>
                <button 
                  onClick={() => handleNavigation('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  About Levare AI
                </button>
                <button 
                  onClick={() => handleNavigation('team')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Meet the Team
                </button>
                <button 
                  onClick={() => handleNavigation('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Contact
                </button>
              </>
            )}
            <ThemeToggle />
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}