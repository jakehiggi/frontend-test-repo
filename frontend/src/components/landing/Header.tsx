import ThemeToggle from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-accent transition-colors duration-200">
              LEVARE AI
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </button>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium relative group"
            >
              About us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <ThemeToggle />
            
            {/* Sleek Buttons */}
            <Button
              asChild
              variant="ghost"
              className="btn-header btn-sleek"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              className="btn-header-primary btn-sleek"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}