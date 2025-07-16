import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BrainCircuit, Shield, CircleFadingArrowUp, Users, Zap } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose LEVARE AI?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I put this section in because I thought it would be a good idea to highlight the key features and benefits of our platform.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <BrainCircuit className="h-8 w-8 text-accent" />,
              title: "Tailored Intelligence",
              description: "Our intelligent agents are custom-designed to fit the specific needs of your business, ensuring effective support. This bespoke approach allows for the optimisation of organisational strategies and performance",
              benefits: ["Sub-second query responses", "Real-time data streaming", "Instant insights"],
            },
            {
              icon: <CircleFadingArrowUp className="h-8 w-8 text-accent" />,
              title: "Continuous Improvement",
              description: "Levare AI promotes ongoing enhancements through real-time insights and analytics, fostering a culture of performance improvement. Our agents consistently identify opportunities for optimising operational processes.",
              benefits: ["SOC 2 Type II certified", "GDPR stuff?", "encryption"],
            },
            {
              icon: <Users className="h-8 w-8 text-accent" />,
              title: "Collaborative Alignment",
              description: "We facilitate seamless collaboration between executive teams and departments, ensuring everyone is aligned towards common goals. This alignment enables outstanding customer experiences and drives organisational success.",
              benefits: ["Role-based access control", "Real-time collaboration", "Audit trails"],
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-card dark:shadow-gray-900/20"
            >
              <CardContent className="p-8">
                <div className="mb-6 p-3 bg-muted rounded-lg w-fit group-hover:scale-110 transition-transform duration-200 border border-transparent hover:border-accent hover:shadow-md hover:shadow-accent/40">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Second Section */}

        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg dark:shadow-gray-900/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Transform Data Into Actionable Insights</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our platform combines the power of artificial intelligence with intuitive design to help you make data-driven decisions faster than ever before. From small startups to enterprise organizations, we provide the tools you need to succeed.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: "Data Sources Connected", value: "500+" },
                  { label: "Queries Per Second", value: "10M+" },
                  { label: "Enterprise Customers", value: "1,200+" },
                  { label: "Uptime Guarantee", value: "99.9%" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200"
                  >
                    <div className="text-2xl font-bold text-accent">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-chart-5 rounded-2xl transform rotate-3" />
              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-lg dark:shadow-gray-900/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Growth</span>
                    <span className="text-sm font-semibold text-accent">+127%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-chart-5 rounded-full w-4/5" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {["Q1", "Q2", "Q3"].map((quarter, idx) => (
                      <div key={quarter} className="text-center">
                        <div className={`h-16 bg-gradient-to-t from-accent to-chart-5 rounded mb-2`} style={{ height: `${(idx + 1) * 20}px` }} />
                        <span className="text-xs text-muted-foreground">{quarter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
