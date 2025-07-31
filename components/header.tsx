"use client"
import {FlipWords} from "@/components/ui/flip-words"
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Link from 'next/link';
import { InfoCard } from "./InfoCard";
import { Github, Sparkles, Zap, Braces, MessageCircleCode, TrendingUp, Search} from "lucide-react";


export default function Header() {
    const words = ["Cite Smarter.", "Powered by AI."]
    const words2 = ["Write Faster.", "Your Assistant."]
    return (
        <>
            <FadeInOnScroll>
                <div className="w-full px-6">
                    <section className="mx-auto flex flex-col md:flex-row items-center justify-between py-16 md:py-24 gap-12 max-w-7xl">
                        <div className="flex-1 space-y-6 max-w-3xl">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                                <FlipWords words={words} />
                            </h1>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-800 leading-tight">
                                <FlipWords words={words2} />
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                                Let AI handle the references, so you can focus on what really matters — your brilliant ideas.
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
                            <button className="hover:cursor-pointer px-8 py-4 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 text-lg">
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
                                <span className="text-gray-600 text-lg">AI Visualization</span>
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
                        <div className="text-center">
                            <h2 className="text-4xl font-semibold text-gray-800 mb-8">Abdur Cader</h2>
                            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-normal">
                                He so so so wow
                            </p>
                        </div>
                    </div>
                </div>
                </FadeInOnScroll>
                <FadeInOnScroll>
                <div className="border-t border-gray-200 py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <h2 className="text-4xl font-semibold text-gray-800 mb-8">How it works</h2>
                            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-normal">
                                OOOOOOOHHHHHHHHHHHH
                            </p>
                        </div>
                    </div>
                </div>
            </FadeInOnScroll>
            <div className="animate-radial-orbit  -mt-1 overflow-hidden font-prompt">
      <svg
        id="wave_on_score"
        className="w-full -mb-4 scale-y-[-1]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 107"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffffff"
          fillRule="nonzero"
          d="M720 38.936531C571.07999 57.866238 321 119.5040168 0 41.09718v66.4480438h1440V40.491756c-320.2408-78.406837-571.07999-20.484932-720-1.555225z"
        />
      </svg>

      {/* Section Title + Subtitle */}
      <FadeInOnScroll>
        <section className="text-center mb-5 py-20 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-white">
            Pop in your files and get your writing sourced in seconds.
          </p>
        </section>
      </FadeInOnScroll>

      {/* 3-Step Info Cards */}
      <FadeInOnScroll>
        <section className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <InfoCard
            svg={<Github />}
            title="Connect Your Sources"
            para="Link your files or input citations to get started instantly."
            step={1}
          />
          <InfoCard
            svg={<Zap />}
            title="Add a Citation"
            para="Paste a link, DOI, or ISBN and we'll format it for you."
            step={2}
          />
          <InfoCard
            svg={<Sparkles />}
            title="Get AI Assistance"
            para="Let AI polish, format, and suggest sources with ease."
            step={3}
          />
        </section>
      </FadeInOnScroll>
    </div>
        </>
    );
}