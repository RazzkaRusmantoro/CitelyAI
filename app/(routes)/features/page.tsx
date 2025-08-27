"use client";
import Navbar from "@/components/navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import {
  FileText,
  Library,
  BookOpen,
  Zap,
  Search,
  Sparkles,
  Braces,
  MessageCircleCode,
  TrendingUp,
  FileCheck,
  Bookmark,
  ClipboardCheck,
  Users,
  Shield,
  Brain,
  FileQuestion,
  MessageCircle,
  Mail,
  FileCode,
  BookOpenCheck,
  ScanSearch,
  BadgeCheck
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Features() {
  const features = [
    {
      title: "Basic AI Citation Assistant",
      description: "Generate standard citations in multiple formats with our free AI assistant",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      details: [
        "Supports APA, MLA, Chicago, and Harvard formats",
        "Simple copy-paste interface for quick citations",
        "Free to use with daily limits",
        "Basic error checking and formatting"
      ],
      image: "/features/citation-basic.jpg",
      cta: "Try Basic Citation"
    },
    {
      title: "Premium AI Citation Assistant",
      description: "Advanced citation generation with smart formatting and style suggestions",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      details: [
        "Advanced AI with contextual understanding",
        "Interactive editor for uploaded documents",
        "Error detection and correction",
        "Batch processing capabilities",
        "Priority processing queue"
      ],
      image: "/features/citation-premium.jpg",
      cta: "Upgrade to Premium"
    },
    {
      title: "Academic Source Finder",
      description: "AI-powered search for relevant academic sources based on your research topic",
      icon: <Search className="w-8 h-8 text-amber-500" />,
      details: [
        "Semantic search across academic databases",
        "Relevance scoring and filtering",
        "Citation metrics and impact factors",
      ],
      image: "/features/source-finder.jpg",
      cta: "Find Sources"
    },
    {
      title: "Academic Citer",
      description: "Automatically format citations from databases and online sources",
      icon: <Braces className="w-8 h-8 text-amber-500" />,
      details: [
        "URL-to-citation conversion",
        "Cross-reference checking",
        "Export to multiple formats"
      ],
      image: "/features/academic-citer.jpg",
      cta: "Try Academic Citer"
    },
    {
      title: "Paper Summarizer",
      description: "Get concise summaries of research papers with key takeaways and insights",
      icon: <MessageCircleCode className="w-8 h-8 text-amber-500" />,
      details: [
        "Quick summarizations",
        "Extracts key findings and methodologies",
        "Identifies research gaps and contributions",
      ],
      image: "/features/paper-summarizer.jpg",
      cta: "Summarize Papers"
    },
    {
      title: "Bibliography Manager",
      description: "Organize, sort, and export your references with one-click efficiency",
      icon: <Library className="w-8 h-8 text-amber-500" />,
      details: [
        "Cloud-based reference storage",
        "Tagging and categorization system",
        "Collaborative bibliographies",
      ],
      image: "/features/bibliography-manager.jpg",
      cta: "Manage Bibliography"
    },
    {
      title: "Source Credibility Checker",
      description: "Evaluate the reliability and factual accuracy of any given source",
      icon: <BadgeCheck className="w-8 h-8 text-amber-500" />,
      details: [
        "Publisher reputation analysis",
        "Author credibility assessment",
        "Fact-checking integration",
        "Bias detection algorithm",
      ],
      image: "/features/credibility-checker.jpg",
      cta: "Check Credibility"
    },
  ];


  return (
    <>
      <div className="relative overflow-hidden min-h-screen flex flex-col">
        <Navbar />
        {/* Background Beams */}
        <div className="absolute inset-0 -z-10">
          <BackgroundBeams />
        </div>

        <div className="flex-1 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header Section */}
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Powerful Features for Academic Success
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Citera's comprehensive suite of AI-powered tools helps you research smarter, 
                  write faster, and cite with confidence.
                </p>
              </div>
            </FadeInOnScroll>

            

            {/* Features Grid */}
            <div className="space-y-32">
              {features.map((feature, index) => (
                <FadeInOnScroll key={index}>
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          {feature.icon}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {feature.title}
                        </h2>
                      </div>
                      <p className="text-xl text-gray-600 mb-6">
                        {feature.description}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 mt-1 mr-3">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors hover:cursor-pointer">
                        {feature.cta}
                      </button>
                    </div>

                    {/* Image/Visual Placeholder */}
                    <div className="flex-1">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 h-64 flex items-center justify-center shadow-inner">
                        <div className="text-center text-gray-500">
                          <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-4">
                            {feature.icon}
                          </div>
                          <p>Feature visualization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            {/* CTA Section
            <FadeInOnScroll>
              <div className="mt-32 text-center bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Research Workflow?
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Join thousands of students and researchers who use Citera to save time and improve their academic work.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                    Get Started Free
                  </button>
                  <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-amber-600 transition-colors">
                    View Pricing
                  </button>
                </div>
              </div>
            </FadeInOnScroll> */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}