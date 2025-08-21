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
  CreditCard,
  Users,
  Shield,
  Brain,
  FileQuestion,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function FAQ() {
  const faqCategories = [
    {
      title: "General Questions",
      icon: <FileQuestion className="w-6 h-6 text-amber-500" />,
      questions: [
        {
          question: "What is Citely?",
          answer: "Citely is an AI-powered citation and research assistant that helps students, researchers, and academics generate accurate citations, find credible sources, and manage bibliographies efficiently."
        },
        {
          question: "How does Citely work?",
          answer: "Citely uses advanced AI algorithms to analyze your content, automatically generate citations in various formats, suggest relevant academic sources, and help organize your references."
        },
        {
          question: "Is Citely free to use?",
          answer: "We offer a free plan with basic features and limited usage. For advanced capabilities and higher usage limits, we have affordable paid plans starting at $9/month."
        }
      ]
    },
    {
      title: "Account & Billing",
      icon: <CreditCard className="w-6 h-6 text-amber-500" />,
      questions: [
        {
          question: "Can I switch plans later?",
          answer: "Yes! You can upgrade, downgrade, or cancel anytime. Changes take effect immediately, and we'll prorate any differences in billing."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and in some regions, bank transfers. All payments are processed securely through Stripe."
        },
        {
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription at any time from your account settings. After cancellation, you'll retain access until the end of your billing period."
        }
      ]
    },
    {
      title: "Features & Usage",
      icon: <Brain className="w-6 h-6 text-amber-500" />,
      questions: [
        {
          question: "What citation styles do you support?",
          answer: "We support all major citation styles including APA, MLA, Chicago, Harvard. Our AI continuously learns new formats based on user needs."
        },
        {
          question: "What file types do you support?",
          answer: "We support DOCX and PDF files for document uploads, and any academic URL for link-to-citation functionality."
        },
        {
          question: "How accurate are the citations?",
          answer: "Our AI maintains 99.9% format accuracy across all major citation styles, with human-reviewed templates and continuous improvement based on user feedback."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-6 h-6 text-amber-500" />,
      questions: [
        {
          question: "Is my data secure?",
          answer: "Absolutely. We use end-to-end encryption and never share your research data with third parties. Your work remains confidential and protected."
        },
        {
          question: "Do you store my documents?",
          answer: "We temporarily process your documents to generate citations but don't store them long-term unless you explicitly save them to your bibliography manager."
        },
        {
          question: "Who can access my research?",
          answer: "Only you have access to your research. We employ strict access controls and encryption to ensure your work remains private."
        }
      ]
    },
    {
      title: "Support",
      icon: <MessageCircle className="w-6 h-6 text-amber-500" />,
      questions: [
        {
          question: "How do I get help if I have issues?",
          answer: "We offer email support with a 24-hour response time for all users. Premium users get priority support with a 4-hour response guarantee."
        },
        {
          question: "Do you offer tutorials or guides?",
          answer: "Yes! We have a comprehensive knowledge base with video tutorials, written guides, and example projects to help you get the most from Citely."
        },
        {
          question: "Can I suggest new features?",
          answer: "We love feature suggestions! You can submit ideas through our feedback portal, and our team reviews all requests regularly."
        }
      ]
    }
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
          <div className="max-w-6xl mx-auto px-6">
            {/* Header Section */}
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find answers to common questions about Citely, our features, 
                  pricing, and how we can help streamline your research process.
                </p>
              </div>
            </FadeInOnScroll>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <FadeInOnScroll key={categoryIndex}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          {category.icon}
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {category.title}
                        </h2>
                      </div>
                    </div>

                    {/* Questions & Answers */}
                    <div className="divide-y divide-gray-100">
                      {category.questions.map((item, index) => (
                        <div key={index} className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-amber-600 text-sm font-bold">Q</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {item.question}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}