import { HeroBackground } from "@/components/landing/HeroBackground";
import { ArrowRight } from "lucide-react";

export default function ProfessionalHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] bg-slate-900 text-white">
        <HeroBackground />
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Elevate Your Business with Levare AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto font-light italic">
              Empowering business leaders with intelligent agents that turn strategic ambition into everyday action.
            </p>
          </div>
        </div>
      </section>

      {/* Business Questions Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Is your business successful because of your people – or in spite of them?
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              "Is your whole organisation aligned to the same purpose?",
              "Do divided tactics compromise your strategy?",
              "Is your strategy well understood and embedded?",
              "Do your people believe in your values and vision?"
            ].map((question, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-card rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}