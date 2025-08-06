"use client";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  Sparkles,
  BookOpen,
  Library,
  FileText,
  Rocket,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description:
        "Good for casual users or students who need quick citations occasionally",
      cta: "Get Started",
      featured: false,
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      features: [
        "1 document upload per day (DOCX/PDF)",
        "Up to 3 AI-suggested citations per doc",
        "Link-to-citation (3/day limit)",
        "Bibliography manager (read-only)",
        "Basic formats (APA & MLA)",
      ],
    },
    {
      name: "Basic",
      price: "$9",
      description: "For active students or writers doing regular academic work",
      cta: "Upgrade Now",
      featured: true,
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      features: [
        "Unlimited document uploads",
        "Unlimited AI citation suggestions",
        "Interactive TipTap editor with hover comments",
        "Export bibliographies (APA/MLA/Chicago)",
        "Unlimited link-to-citation",
        "Paper summarizer (5 summaries/month)",
      ],
    },
    {
      name: "Pro",
      price: "$24",
      description:
        "For researchers, postgrads, and professionals writing constantly",
      cta: "Go Pro",
      featured: false,
      icon: <Rocket className="w-6 h-6 text-purple-500" />,
      features: [
        "Harvard + custom citation styles",
        "Priority AI processing",
        "Advanced bibliography manager with folders",
        "Unlimited paper summarizer",
        "Document insights & citation stats",
        "Early access to new AI features",
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Beams */}
      <div className="absolute inset-0 -z-10">
        <BackgroundBeams />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your research workflow with AI-powered tools
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <FadeInOnScroll key={tier.name}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card
                  className={`h-full flex flex-col ${
                    tier.featured
                      ? "border-2 border-amber-400 shadow-lg"
                      : "border-gray-200"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {tier.icon}
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {tier.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-2 text-gray-600">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                      {tier.price !== "$0" && (
                        <span className="text-gray-600">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className={`w-full ${
                        tier.featured
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </FadeInOnScroll>
          ))}
        </div>

        <FadeInOnScroll>
          <div className="mt-24 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Frequently asked questions
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Can I switch
                  plans later?
                </h4>
                <p className="text-gray-600">
                  Yes! You can upgrade, downgrade, or cancel anytime. Changes
                  take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Library className="w-5 h-5 text-blue-500" /> What file types
                  do you support?
                </h4>
                <p className="text-gray-600">
                  We support DOCX and PDF files for document uploads, and any
                  academic URL for link-to-citation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" /> How accurate
                  are the citations?
                </h4>
                <p className="text-gray-600">
                  Our AI maintains 99.9% format accuracy across all major
                  citation styles, with human-reviewed templates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" /> Is my data secure?
                </h4>
                <p className="text-gray-600">
                  Absolutely. We use end-to-end encryption and never share your
                  research data with third parties.
                </p>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
