import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Globe, Shield, TrendingUp, Users, Zap } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose DataFlow?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're revolutionizing how businesses understand and leverage their data with cutting-edge AI technology and enterprise-grade infrastructure.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Zap className="h-8 w-8 text-blue-600" />,
              title: "Lightning Fast",
              description: "Process millions of data points in real-time with our optimized algorithms and distributed computing architecture.",
              benefits: ["Sub-second query responses", "Real-time data streaming", "Instant insights"],
            },
            {
              icon: <Shield className="h-8 w-8 text-green-600" />,
              title: "Enterprise Security",
              description: "Bank-level security with end-to-end encryption, compliance certifications, and advanced threat protection.",
              benefits: ["SOC 2 Type II certified", "GDPR compliant", "256-bit encryption"],
            },
            {
              icon: <Users className="h-8 w-8 text-purple-600" />,
              title: "Team Collaboration",
              description: "Built for teams with advanced sharing, commenting, and workflow management features that scale with your organization.",
              benefits: ["Role-based access control", "Real-time collaboration", "Audit trails"],
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/20"
            >
              <CardContent className="p-8">
                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg dark:shadow-gray-900/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Transform Data Into Actionable Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
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
                    className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border dark:border-gray-700 shadow-lg dark:shadow-gray-900/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Revenue Growth</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">+127%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-4/5" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {["Q1", "Q2", "Q3"].map((quarter, idx) => (
                      <div key={quarter} className="text-center">
                        <div className={`h-16 bg-gradient-to-t from-blue-500 to-purple-500 rounded mb-2`} style={{ height: `${(idx + 1) * 20}px` }} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{quarter}</span>
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
