import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-xl font-bold text-foreground">
              LEVARE AI
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">Features</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">Pricing</button>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              About us
            </Link>
            <ThemeToggle />
            <Button
              asChild
              className="bg-gradient-to-r from-accent to-chart-5 hover:from-accent hover:to-chart-5 transform hover:scale-105 transition-all duration-200"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-accent to-chart-5 hover:from-accent hover:to-chart-5 transform hover:scale-105 transition-all duration-200"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
