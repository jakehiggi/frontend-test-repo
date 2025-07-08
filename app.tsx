"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  CheckCircle,
  TrendingUp,
  Globe,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function App() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    // Auto-advance carousel every 5 seconds
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

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
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
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
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 font-medium">
                Features
              </button>
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 font-medium">
                Pricing
              </button>
              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 font-medium">
                About
              </button>
              <ThemeToggle />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
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
                            <Button
                              size="lg"
                              className="bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
                            >
                              Start Free Trial
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200 bg-transparent"
                            >
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

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                current === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </section>

      {/* Company Description Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose DataFlow?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how businesses understand and leverage their data with cutting-edge AI technology
              and enterprise-grade infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "Lightning Fast",
                description:
                  "Process millions of data points in real-time with our optimized algorithms and distributed computing architecture.",
                benefits: ["Sub-second query responses", "Real-time data streaming", "Instant insights"],
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Enterprise Security",
                description:
                  "Bank-level security with end-to-end encryption, compliance certifications, and advanced threat protection.",
                benefits: ["SOC 2 Type II certified", "GDPR compliant", "256-bit encryption"],
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "Team Collaboration",
                description:
                  "Built for teams with advanced sharing, commenting, and workflow management features that scale with your organization.",
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

          {/* Value Proposition */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg dark:shadow-gray-900/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Transform Data Into Actionable Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Our platform combines the power of artificial intelligence with intuitive design to help you make
                  data-driven decisions faster than ever before. From small startups to enterprise organizations, we
                  provide the tools you need to succeed.
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
                          <div
                            className={`h-16 bg-gradient-to-t from-blue-500 to-purple-500 rounded mb-2`}
                            style={{ height: `${(idx + 1) * 20}px` }}
                          />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">DataFlow</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering businesses with AI-powered analytics and insights that drive growth and innovation.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Linkedin, Github].map((Icon, index) => (
                  <button
                    key={index}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 transform hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "API Documentation", "Integrations"].map((item) => (
                  <li key={item}>
                    <button className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200">
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
                    <button className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5" />
                  <span>hello@dataflow.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} DataFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <button
                  key={item}
                  className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 text-sm transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
