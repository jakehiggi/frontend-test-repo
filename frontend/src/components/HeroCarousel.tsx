import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  TrendingUp,
} from "lucide-react";

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    const interval = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  const heroSlides = [
    {
      title: "Transform Your Business with AI-Powered Analytics",
      subtitle: "Unlock insights that drive growth",
      description:
        "Harness the power of artificial intelligence to analyze your data, predict trends, and make informed decisions that accelerate your business growth.",
      icon: <TrendingUp className="h-16 w-16 text-blue-500" />,
      gradient: "from-blue-600 to-purple-600",
      features: ["Real-time Analytics", "Predictive Modeling", "Custom Dashboards"],
    },
    {
      title: "Scale Globally with Confidence",
      subtitle: "Enterprise-grade infrastructure",
      description:
        "Built for scale with 99.9% uptime guarantee. Our robust infrastructure supports businesses from startups to Fortune 500 companies worldwide.",
      icon: <Globe className="h-16 w-16 text-green-500" />,
      gradient: "from-green-600 to-teal-600",
      features: ["Global CDN", "Auto-scaling", "24/7 Monitoring"],
    },
    {
      title: "Ready to Get Started?",
      subtitle: "Join thousands of satisfied customers",
      description:
        "Start your free trial today and experience the difference our platform can make for your business. No credit card required.",
      icon: <CheckCircle className="h-16 w-16 text-orange-500" />,
      gradient: "from-orange-600 to-red-600",
      features: ["14-day Free Trial", "No Setup Fees", "Cancel Anytime"],
      cta: true,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className={`relative min-h-[600px] bg-gradient-to-br ${slide.gradient} text-white`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {slide.subtitle}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">{slide.title}</h1>
                        <p className="text-xl text-white/90 leading-relaxed">{slide.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {slide.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white/10 text-white border-white/30">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      {slide.cta && (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200 bg-transparent">
                            Watch Demo
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform scale-150" />
                        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                          {slide.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${current === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
