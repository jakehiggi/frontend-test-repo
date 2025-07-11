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
import { ArrowRight, CheckCircle, Globe, TrendingUp } from "lucide-react";

import { HeroBackground } from "@/components/HeroBackground";

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
    }, 100000);
    return () => clearInterval(interval);
  }, [api]);

  const heroSlides = [
    {
      title: "Elevate your business with Levare AI",
      subtitle: "Unlock insights that drive growth",
      description:
        "Empowering business leaders with intelligent agents. Our platform turns ambition into everyday action.",
      icon: <TrendingUp className="h-16 w-16 text-blue-500" />,
      gradient: "from-blue-600 to-purple-600",
      features: ["something", "something else", "Custom Dashboards"],
    },
    {
      title: "Lorem ipsum dolor sit amet",
      subtitle: "ipsum dolor sit amet",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: <Globe className="h-16 w-16 text-green-500" />,
      gradient: "from-green-600 to-teal-600",
      features: ["Global CDN", "Auto-scaling", "24/7 Monitoring"],
    },
    {
      title: "Ready to Get Started?",
      subtitle: "join now.., ",
      description:
        "register interest etc. etc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      icon: <CheckCircle className="h-16 w-16 text-orange-500" />,
      gradient: "from-orange-600 to-red-600",
      features: ["join up", "it's cool", "blah"],
      cta: true,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative min-h-[600px] bg-black text-white overflow-hidden">

                <HeroBackground />

                {/* Slide Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-30`} />
                <div className="absolute inset-0 bg-black/10" />

                {/* Slide Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                  <div className="grid lg:grid-cols-[3fr_1fr] gap-6 items-center">
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
                        </div>
                      )}
                    </div>
                    {/* Icon}
                    <div className="flex justify-center"> 
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform scale-150" />
                        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                          {slide.icon}
                        </div>
                      </div>     
                    </div>
                    Icon container end */}
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
