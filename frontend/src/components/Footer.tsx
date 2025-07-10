import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">LEVARE AI</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Empowering businesses with AI.
            </p>
            <div className="flex space-x-4">
              {[Mail, Linkedin].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 bg-muted rounded-lg hover:bg-accent transition-colors duration-200 transform hover:scale-110"
                >
                  <Icon className="h-5 w-5 text-foreground" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "API Documentation", "Integrations"].map((item) => (
                <li key={item}>
                  <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>email@levareai.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>Phone number here?</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Location here?</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} LEVARE AI. All rights reserved.</p>
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