import ThemeToggle from "../ThemeToggle";
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
          <div className="flex items-center space-x-6">
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
              What Levare AI Does
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
              Levare Intelligent Agents
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
              Meet the Team
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
              Contact
            </button>
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