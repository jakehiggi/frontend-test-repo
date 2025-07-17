import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Zap } from "lucide-react";

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

export default function Footer() {
  const isLandingPage = window.location.pathname === '/';

  return (
    <footer className="bg-muted/30 text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-accent to-chart-5 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LEVARE AI</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Empowering business leaders with intelligent agents that turn strategic ambition into everyday action.
            </p>
            <div className="flex space-x-3">
              {[Mail, Linkedin].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 bg-background rounded-lg hover:bg-accent transition-colors duration-200 transform hover:scale-110 shadow-sm border"
                >
                  <Icon className="h-4 w-4 text-foreground" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-2">
              {[
                { name: "What Levare AI Does", id: "what-levare-does" },
                { name: "About Levare AI", id: "about" },
                { name: "Meet the Team", id: "team" },
                { name: "Contact", id: "contact" }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={() => isLandingPage ? scrollToSection(item.id) : handleNavigation(item.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@levareai.com</span>
              </div>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Get in touch for enquiries</span>
              </div>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">United Kingdom</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LEVARE AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <button
                key={item}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}