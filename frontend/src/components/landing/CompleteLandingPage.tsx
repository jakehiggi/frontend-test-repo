import { HeroBackground } from "@/components/landing/HeroBackground";
import { ArrowRight, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function CompleteLandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Is your business successful because of your people – or in spite of them?
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              "Is your whole organisation aligned to the same purpose?",
              "Do divided tactics compromise your strategy?",
              "Is your strategy well understood and embedded?",
              "Do your people believe in your values and vision?"
            ].map((question, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
                <p className="text-base text-foreground leading-relaxed">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Levare AI Does Section */}
      <section id="what-levare-does" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              What Levare AI Does
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our intelligent agents deliver three core services to transform your business operations
            </p>
          </div>

          <div className="space-y-12">
            {/* Performance Optimisation */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Performance Optimisation
                </h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  Levare AI's Performance Optimisation service leverages advanced algorithms to streamline operations and boost productivity. By continuously monitoring key performance indicators, our intelligent agents provide tailored recommendations that align with your strategic goals. Experience heightened efficiency and foster a culture of excellence within your organisation. Achieve more with less effort by allowing our technology to empower your teams.
                </p>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Get Started
                </Button>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 aspect-video flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-20 h-20 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="text-primary font-mono text-xs">
                      [Matrix Data Visual]
                    </div>
                  </div>
                  <div className="text-sm">Performance Optimisation Image Placeholder</div>
                </div>
              </div>
            </div>

            {/* Strategic Alignment */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="lg:order-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Strategic Alignment
                </h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  The Strategic Alignment service offered by Levare AI enhances communication and cooperation across departments. By integrating our intelligent agents into your workflow, you can ensure that all teams are aligned with the company's vision and initiatives. This service facilitates real-time collaboration, helping to break down silos and cultivate a more inclusive decision-making process. Experience the power of a cohesive organisation that drives innovation and success.
                </p>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Get Started
                </Button>
              </div>
              <div className="lg:order-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 aspect-video flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-20 h-20 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="text-primary font-mono text-xs">
                      [Laptop/Workflow]
                    </div>
                  </div>
                  <div className="text-sm">Strategic Alignment Image Placeholder</div>
                </div>
              </div>
            </div>

            {/* Customer Experience Enhancement */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Customer Experience Enhancement
                </h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  Levare AI's Customer Experience Enhancement service equips you with the tools necessary to elevate your client's journey. By analysing customer interactions and feedback, our intelligent agents provide actionable insights that help tailor your offerings to meet their expectations. This service promotes proactive engagement and personalised communication, ensuring that your customers feel valued and understood. Unlock new levels of satisfaction and loyalty, ultimately driving your business success.
                </p>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Get Started
                </Button>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 aspect-video flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-20 h-20 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="text-primary font-mono text-xs">
                      [Network/AI Visual]
                    </div>
                  </div>
                  <div className="text-sm">Customer Experience Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Levare AI Section */}
      <section id="about" className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              About Levare AI
            </h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Founded with the vision to revolutionise business strategy, Levare AI emerged in the heart of the tech boom. Recognising the potential of artificial intelligence, we set out to create advanced solutions tailored for executive needs. Our journey has led us to develop intelligent agents that seamlessly integrate into organisational frameworks. Over the years, we have continually refined our technology to ensure optimal performance management.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              We proudly serve a diverse portfolio of clients across multiple industries, from finance to healthcare. Our solutions have empowered startups and established enterprises alike, enhancing their operational efficiencies. With a focus on customer satisfaction, we strive to meet the unique needs of each client. Together, we create tailored strategies that drive success and align with organisational goals.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section id="team" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Meet our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're a founding team of strategists, technologists, and operators united by a single mission: to revolutionise business execution through intelligent, AI-driven agents. With deep experience in leadership, data operations, and high-performance frameworks, we're building Levare to help organisations turn strategy into action – at speed and at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Row 1 */}
            {[
              {
                name: "Rory Underwood",
                title: "DIRECTOR",
                bio: "A former RAF fast-jet pilot and record-holding England international rugby player, Rory has spent the last two decades using state-level performance principles into the corporate arena. As founder and Chief Executive of the LiFT™ model he has helped over 200 organisations set up strategy, people, and process to drive high performance. At Levare, he provides vision and governance, ensuring the platform reflects the real-world challenges senior teams face and providing the critical insights to drive practical, proven thinking. Rory brings a rare blend of disciplined execution and strategic insight to Levare's mission."
              },
              {
                name: "Ian West",
                title: "CHAIRMAN",
                bio: "Ian is a serial technology investor and non-executive director with 25 years' board-level experience across early-stage to growth stage services companies from seed stage to successful exit. As West's Group Chairman he steers corporate governance, investor relations, and board-level strategy, with a track record in scaling SaaS platforms across Europe and North America. Ian's multi-industry expertise for cross rounds, and building high-performing leadership teams. His calm, commercially-focused oversight provides Levare's founders with the strategic runway to innovate quickly while maintaining rigorous financial discipline."
              },
              {
                name: "Paul Johnson",
                title: "COO & GLOBAL HEAD OF DELIVERY",
                bio: "Paul has led complex, mission-critical programmes on five continents, delivering digital transformation projects for FTSE 100 firms and high-growth scale-ups alike. A qualified programme/project manager and former Royal Navy officer, he now orchestrates Levare's day-to-day operations, product roadmap, and client implementation teams. Paul's hands-on, military-grade project discipline with agile delivery methods, ensuring every release of Dedalus meets enterprise-class reliability and security standards. His front covers resource planning, global partner ecosystems, and customer success, making him the engine room of Levare's rapid, quality-centred growth."
              }
            ].map((member, index) => (
              <Card key={index} className="bg-card border-border min-h-[400px]">
                <CardContent className="p-5">
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground text-m font-medium mb-3">{member.title}</p>
                  <p className="text-muted-foreground text-s leading-relaxed line-clamp-10">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Jake Higgins",
                title: "HEAD OF AI INFRASTRUCTURE & ENGINEERING",
                bio: "A self-described 'data geek', Jake graduated from the University of Leeds with a Master's in Physics & Astronomy, producing a Python-driven thesis that modelled stellar dynamics. Since then he has immersed himself in machine-learning research, prompt engineering, and scalable cloud infrastructure. At Levare he architects and leads the build of the AI core that powers Dedalus and the wider intelligent-agent suite, overseeing model selection, data pipelines, MLOps, and security. Jake's combination of deep analytical rigour and experimental curiosity drives Levare's technical edge, enabling rapid iteration from to production-grade systems."
              },
              {
                name: "Jane McClelland",
                title: "HEAD OF BUSINESS EXECUTION",
                bio: "Jane is the strategic force behind translating Wingman's LiFT™ methodology into Levare's intelligent agents. With two decades in strategy consultancy, and senior operational excellence programmes, she has guided leadership teams across sectors to sharpen execution and embed high-performance cultures. At Levare she owns product-market fit, feature prioritisation, and the application of execution frameworks within the platform, ensuring clients receive actionable insights, not just analytics. Jane balances big-picture vision with hands-on delivery, championing user-centred design and measurable business outcomes at every stage of the product lifecycle."
              }
            ].map((member, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground text-m font-medium mb-3">{member.title}</p>
                  <p className="text-muted-foreground text-s leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                We are here to assist you. Reach out for enquiries and support.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We value your input. Connect with us for any questions or collaborations.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Email:</span>
                </div>
                <p className="text-muted-foreground ml-8">info@levareai.com</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input id="name" placeholder="Your name" className="w-full" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input id="email" type="email" placeholder="Your email" className="w-full" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea id="message" placeholder="Your message" rows={5} className="w-full" />
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}