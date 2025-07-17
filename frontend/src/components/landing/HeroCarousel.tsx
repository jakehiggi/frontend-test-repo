import { useState, useEffect, useCallback } from "react";
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
import { ArrowRight, Sparkles, TrendingUp, Zap, Brain } from "lucide-react";

export default function OptimizedHeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Optimize carousel auto-play with useCallback
  const handleAutoPlay = useCallback(() => {
    if (!api) return;
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    
    // Reduced auto-play frequency to reduce re-renders
    const interval = setInterval(handleAutoPlay, 10000); // 10 seconds instead of 8
    return () => clearInterval(interval);
  }, [api, handleAutoPlay]);

  const heroSlides = [
    {
      title: "Elevate your business with Levare AI",
      subtitle: "Unlock insights that drive growth",
      description: "Transform your organization with intelligent agents designed for your specific needs. From data analysis to strategic planning, our AI becomes your competitive advantage.",
      icon: <TrendingUp className="h-8 w-8" />,
      features: ["Real-time Analytics", "Custom AI Agents", "Enterprise Security"],
    },
    {
      title: "Intelligence at Scale",
      subtitle: "Enterprise-ready AI solutions",
      description: "Deploy sophisticated AI systems that grow with your business. Our platform handles everything from data ingestion to actionable insights, all while maintaining enterprise-grade security.",
      icon: <Brain className="h-8 w-8" />,
      features: ["Scalable Architecture", "Advanced ML Models", "24/7 Support"],
    },
    {
      title: "Ready to Transform?",
      subtitle: "Start your AI journey today",
      description: "Join thousands of organizations already leveraging our platform to make smarter decisions, faster. Experience the future of business intelligence.",
      icon: <Sparkles className="h-8 w-8" />,
      features: ["Free Trial", "Expert Onboarding", "Proven Results"],
      cta: true,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      {/* Simplified background - no animations for better performance */}
      <div className="absolute inset-0">
        {/* Static grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Static geometric shapes - no animations */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full" />
        
        {/* Static radial gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          }}
        />
      </div>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative min-h-[80vh] flex items-center">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {slide.subtitle}
                        </Badge>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                            {slide.title}
                          </span>
                        </h1>
                        
                        <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                          {slide.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {slide.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="bg-white/5 text-white border-white/20 backdrop-blur-sm hover:bg-white/10 transition-colors"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {slide.cta && (
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button 
                            size="lg" 
                            className="bg-white text-blue-900 hover:bg-blue-50 font-semibold transition-all duration-200 shadow-xl"
                          >
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
                          >
                            Schedule Demo
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Simplified Visual Element */}
                    <div className="relative flex justify-center lg:justify-end">
                      <div className="relative">
                        {/* Simplified icon container - no complex animations */}
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl">
                            {slide.icon}
                          </div>
                          
                          {/* Static accent elements - no animations */}
                          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg opacity-80" />
                          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-60" />
                          <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-md opacity-70" />
                        </div>

                        {/* Simplified background glow - no animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 opacity-20 blur-3xl scale-150 -z-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Simplified navigation */}
        <CarouselPrevious className="left-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" />
        <CarouselNext className="right-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" />
      </Carousel>

      {/* Simplified slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index 
                ? "bg-white shadow-lg scale-125" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}