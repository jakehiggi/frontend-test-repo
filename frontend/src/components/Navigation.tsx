import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DataFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <ThemeToggle />
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
