"use client";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Link from "next/link";
import { InfoCard } from "./InfoCard";
import { Footer } from "@/components/Footer";
import { TextCompare } from "@/components/compare";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Github,
  Sparkles,
  Zap,
  Braces,
  MessageCircleCode,
  TrendingUp,
  Search,
  Rocket,
  Check,
  BookOpen,
  Library,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";



import { BackgroundBeams } from "@/components/ui/background-beams";
import { CarouselShowcase } from "./CarouselShowcase";

export default function Header() {
  const router = useRouter();
  
    const handleCheckout = async (price: number) => {
      try {
        const response = await fetch('/api/stripe-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ price }),
        });
  
        const data = await response.json();
        if (data.url) {
          router.push(data.url);
        }
      } catch (error) {
        console.error('Checkout error:', error);
      }
    };
  
    const tiers = [
      {
        name: "Free",
        price: "$0",
        description:
          "Good for casual users or students who need quick citations occasionally",
        cta: "Current Plan",
        featured: false,
        icon: <Sparkles className="w-6 h-6 text-amber-500" />,
        features: [
          "5 documents per day (DOCX/PDF)",
          "Bibliography manager",
          "Academic Source Finder",
          "Source Credibility Checker",
          "Academic Citer"
        ],
      },
      {
        name: "Basic",
        price: "$9",
        priceValue: 900,
        description: "For active students or writers doing regular academic work",
        cta: "Upgrade Now",
        featured: true,
        icon: <Zap className="w-6 h-6 text-blue-500" />,
        features: [
          "All Previous Plan's Benefits",
          "30 documents per day (DOCX/PDF)",
          "Bibliography manager",
          "Academic Source Finder",
          "Source Credibility Checker",
          "Academic Citer",
        ],
      },
      {
        name: "Pro",
        price: "$24",
        priceValue: 2400,
        description:
          "For researchers, postgrads, and professionals writing constantly",
        cta: "Go Pro",
        featured: false,
        icon: <Rocket className="w-6 h-6 text-purple-500" />,
        features: [
          "All Previous Plan's Benefits",
          "Priority AI processing",
          "Premium AI Citation Assistant Interactive Tool",
          "Advanced bibliography manager with folders",
          "Early access to new AI features",
        ],
      },
    ];

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
                Why use Citera?
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

      <div className="animate-radial-orbit  overflow-hidden font-prompt">
        {/* <svg
          id="wave_on_score"
          className="w-full -mb-0 scale-y-[-1]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 107"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9FAFB"
            fillRule="nonzero"
            d="M720 38.936531C571.07999 57.866238 321 119.5040168 0 41.09718v66.4480438h1440V40.491756c-320.2408-78.406837-571.07999-20.484932-720-1.555225z"
          />
        </svg> */}

        {/* Section Title + Subtitle */}
        <FadeInOnScroll>
          <section className="text-center py-20 px-4 sm:px-6 lg:px-8 mt-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need, All in One
            </h2>
            <p className="text-2xl max-w-2xl mx-auto text-white">
              Our comprehensive suite of AI-powered research tools
            </p>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <CarouselShowcase className="mb-20" />
        </FadeInOnScroll>
{/* 
        <FadeInOnScroll>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
            <InfoCard
              svg={<Sparkles className="w-6 h-6" />}
              title="Basic AI Citation Assistant"
              para="Generate citations instantly in any format with our free AI assistant."
              step={1}
            />

            <InfoCard
              svg={<Zap className="w-6 h-6" />}
              title="Premium AI Citation Assistant"
              para="Advanced citation generation with style suggestions and error detection."
              step={2}
            />

            <InfoCard
              svg={<Search className="w-6 h-6" />}
              title="Academic Source Finder"
              para="AI-powered search for relevant academic sources based on your topic."
              step={3}
            />

            <InfoCard
              svg={<MessageCircleCode className="w-6 h-6" />}
              title="Paper Summarizer"
              para="Get concise summaries of research papers with key takeaways."
              step={4}
            />

            <InfoCard
              svg={<TrendingUp className="w-6 h-6" />}
              title="Source Credibility Checker"
              para="Evaluates the reliability and factual accuracy of any given source."
              step={5}
            />

            <InfoCard
              svg={<Braces className="w-6 h-6" />}
              title="Bibliography Manager"
              para="Organize, sort, and export your references with one click."
              step={6}
            />
          </section>
        </FadeInOnScroll> */}

        <FadeInOnScroll>
          <div className="py-20 ">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-semibold text-white mb-4">
                  What People Are Saying
                </h2>
                <p className="text-xl text-white max-w-2xl mx-auto">
                  Hear from users who transformed their research workflow
                </p>
              </div>

              {/* <div className="relative">
                Decorative elements
                <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-amber-200/20 blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-purple-200/20 blur-xl"></div>
                
                <div className="relative bg-white p-10 rounded-3xl shadow-lg border border-gray-100 transform hover:scale-[1.01] transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="white" 
                        className="w-10 h-10"
                      >
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                      </svg>
                    </div>
                    

                    <div className="text-center md:text-left">
                      <div className="text-2xl font-medium text-gray-800 mb-4">
                        "Your comment/testimonial goes here. Describe how Citera has helped you in your academic work and research process."
                      </div>
                      <div className="text-lg text-gray-600">
                        <p className="font-medium">Your Name</p>
                        <p className="text-gray-500">Your Position/Role</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 left-6 text-gray-200 text-7xl font-serif -z-10">“</div>
                  <div className="absolute bottom-6 right-6 text-gray-200 text-7xl font-serif -z-10">”</div>
                </div>
              </div> */}
            </div>
          </div>
        </FadeInOnScroll>
        {/* <svg
          id="wave_on_score"
          className="w-full -mb-4 mt-30 scale-x-[-1]" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 107"
          preserveAspectRatio="none"
        >
          <path
            fill="#F9FAFB"
            fillRule="nonzero"
            d="M720 38.936531C571.07999 57.866238 321 119.5040168 0 41.09718v66.4480438h1440V40.491756c-320.2408-78.406837-571.07999-20.484932-720-1.555225z"
          />
        </svg> */}
        {/* If it was placed here */}
        
      </div>

      <div className = "bg-gray-50 -mt-3 overflow-hidden">
        <FadeInOnScroll>
        <div className="max-w-7xl mx-auto px-6 mt-10 mb-30">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Text content on the left */}
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                See the Difference
              </h2>
              <p className="text-xl text-gray-800">
                Compare how Citera transforms your research workflow versus traditional methods.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">AI-Powered Efficiency</h3>
                    <p className="text-gray-800">
                      Our AI handles the tedious work so you can focus on your research.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Lightning Fast</h3>
                    <p className="text-gray-800">
                      Generate citations in seconds that would normally take hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Academic Advantage</h3>
                    <p className="text-gray-800">
                      Get higher quality references with our AI-powered suggestions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison component on the right */}
            <div className="flex-1 mt-20 ">
              <div className="p-4 border rounded-3xl border-neutral-200 bg-white shadow-lg">
                <TextCompare
                  beforeText={`Artificial intelligence has undergone remarkable transformations since its conceptual beginnings. The field has progressed from simple rule-based systems to complex machine learning algorithms capable of pattern recognition and decision-making.\n\nHowever, many academic papers still struggle with proper citation formatting, often leaving references incomplete or improperly formatted. This creates challenges for readers trying to verify sources and for authors maintaining academic integrity.`}
                  
                  afterText={`Artificial intelligence has undergone remarkable transformations since its conceptual beginnings (McCarthy, 1956). The field has progressed from simple rule-based systems to complex machine learning algorithms capable of pattern recognition and decision-making (Russell & Norvig, 2020).\n\nHowever, many academic papers still struggle with proper citation formatting, often leaving references incomplete or improperly formatted (Smith et al., 2021). This creates challenges for readers trying to verify sources and for authors maintaining academic integrity.`}
                  
                  className="h-auto min-h-[400px]"
                  beforeClassName="bg-gray-50"
                  afterClassName="bg-gray-50"
                  slideMode="hover"
                />
              </div>
              <div className = "">

              </div>
            </div>
          </div>
        </div>
        </FadeInOnScroll>  
        <FadeInOnScroll>
          <div className="border-t border-gray-200 py-20 bg-white">

          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="border-t border-gray-200 py-20 bg-gray-50">

          </div>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="border-t border-gray-200 py-20 bg-white">
              <div className="relative overflow-hidden flex flex-col">
                <div className="max-w-7xl mx-auto px-6 pb-24 w-full py-24 sm:py-18">
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
                                className={`w-full hover:cursor-pointer ${
                                  tier.featured
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                                    : "bg-gray-900 hover:bg-gray-800"
                                }`}
                                onClick={() => {
                                  if (tier.priceValue) {
                                    handleCheckout(tier.priceValue);
                                  }
                                }}
                                disabled={!tier.priceValue}
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
          </div>
        </FadeInOnScroll>
        <Footer/>
      </div>
    </>
  );
}
