"use client";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import { Carousel } from "@/components/ui/carousel";
import Link from "next/link";
import { InfoCard } from "./InfoCard";
import { Footer } from "@/components/Footer";
import {
  Github,
  Sparkles,
  Zap,
  Braces,
  MessageCircleCode,
  TrendingUp,
  Search,
} from "lucide-react";

import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Header() {
  const words = ["Cite Smarter.", "Powered by AI."];
  const words2 = ["Write Faster.", "Your Assistant."];
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <>
      <FadeInOnScroll>
        <div className="w-full px-6 relative overflow-hidden">
          {/* Background Beams */}
          <div className="absolute inset-0 -z-10">
            <BackgroundBeams />
          </div>

          <section className="mx-auto flex flex-col md:flex-row items-center justify-between py-16 md:py-24 gap-12 max-w-7xl relative z-10">
            <div className="flex-1 space-y-6 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <FlipWords words={words} />
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-800 leading-tight">
                <FlipWords words={words2} />
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                Let AI handle the references, so you can focus on what really
                matters — your brilliant ideas.
              </p>

              <div className="flex gap-6 pt-6">
                <Link
                  href="/dashboard/home"
                  className="group relative px-6 py-3 cursor-pointer rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-black font-bold tracking-wider text-md hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 transform hover:rotate-1 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] active:scale-90 overflow-hidden flex items-center justify-center"
                >
                  <span className="flex items-center gap-2 z-10 text-white">
                    Start Citing
                    <svg
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
                    >
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-tl from-amber-200/40 via-transparent to-transparent"></div>
                  <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
                </Link>
                <button className="hover:cursor-pointer bg-white px-8 py-4 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 text-lg">
                  Learn More
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center w-full">
              <div className="relative w-full max-w-lg aspect-square bg-gradient-to-tr from-blue-50 to-purple-50 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative z-10 p-10 text-center">
                  <span className="text-2xl font-medium text-gray-700">
                    Interactive Demo
                  </span>
                  <div className="mt-6 h-64 w-full bg-white/90 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-lg">
                      AI Visualization
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <div className="border-t border-gray-200 py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-gray-800 mb-4">
                Why use Citely?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The smartest way to manage citations and references with
                AI-powered tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-100 group">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors duration-300">
                  <TrendingUp className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Academic Efficiency
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Save hours of manual work with automatic citation generation
                  and formatting in any style.
                </p>
              </div>

              {/* 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  <Braces className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Smart Formatting
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Perfectly formatted citations in APA, MLA, Chicago, and more
                  with just one click.
                </p>
              </div>

              {/* 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-100 group">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors duration-300">
                  <Search className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Source Discovery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  AI suggests relevant sources based on your writing to
                  strengthen your arguments.
                </p>
              </div>

              {/* 4 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-100 group">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors duration-300">
                  <MessageCircleCode className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  In-Text Assistance
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get smart suggestions for where to place citations and how to
                  integrate them naturally.
                </p>
              </div>

              {/* 5 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-100 group">
                <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors duration-300">
                  <Sparkles className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI checks your citations for completeness and accuracy,
                  flagging potential issues.
                </p>
              </div>

              {/* 6 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors duration-300">
                  <Zap className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Process hundreds of references in seconds with our optimized
                  citation engine.
                </p>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-amber-600 mb-2">
                  10x
                </div>
                <div className="text-gray-600">Faster citation</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Instant Citation Assistance</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">Accuracy rate</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  50k+
                </div>
                <div className="text-gray-600">Happy Abdur Rahmans</div>
              </div>
            </div>
          </div>
        </div>
      </FadeInOnScroll>

      <div className="animate-radial-orbit -mt-1 overflow-hidden font-prompt">
        <svg
          id="wave_on_score"
          className="w-full -mb-4 scale-y-[-1]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 107"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9FAFB"
            fillRule="nonzero"
            d="M720 38.936531C571.07999 57.866238 321 119.5040168 0 41.09718v66.4480438h1440V40.491756c-320.2408-78.406837-571.07999-20.484932-720-1.555225z"
          />
        </svg>

        {/* Section Title + Subtitle */}
        <FadeInOnScroll>
          <section className="text-center mb-5 py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need, All in One
            </h2>
            <p className="text-2xl max-w-2xl mx-auto text-white">
              Our comprehensive suite of AI-powered research tools
            </p>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
            {/* Basic AI Citation Assistant */}
            <InfoCard
              svg={<Sparkles className="w-6 h-6" />}
              title="Basic AI Citation Assistant"
              para="Generate citations instantly in any format with our free AI assistant."
              step={1}
            />

            {/* Premium AI Citation Assistant */}
            <InfoCard
              svg={<Zap className="w-6 h-6" />}
              title="Premium AI Citation Assistant"
              para="Advanced citation generation with style suggestions and error detection."
              step={2}
            />

            {/* Academic Source Finder */}
            <InfoCard
              svg={<Search className="w-6 h-6" />}
              title="Academic Source Finder"
              para="AI-powered search for relevant academic sources based on your topic."
              step={3}
            />

            {/* Paper Summarizer */}
            <InfoCard
              svg={<MessageCircleCode className="w-6 h-6" />}
              title="Paper Summarizer"
              para="Get concise summaries of research papers with key takeaways."
              step={4}
            />

            {/* Research Skimmer */}
            <InfoCard
              svg={<TrendingUp className="w-6 h-6" />}
              title="Research Skimmer"
              para="Quickly extract key information from multiple sources at once."
              step={5}
            />

            {/* Bibliography Manager */}
            <InfoCard
              svg={<Braces className="w-6 h-6" />}
              title="Bibliography Manager"
              para="Organize, sort, and export your references with one click."
              step={6}
            />
          </section>
        </FadeInOnScroll>
      </div>
      <Footer />
    </>
  );
}
