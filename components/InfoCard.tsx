"use client";
import React, { useState } from "react";
import { Hind_Siliguri } from "next/font/google";

const HindFont = Hind_Siliguri({
    subsets: ['latin'],
    weight: '300',
    variable: '--font-hind'
})

interface InfoCardProps {
  svg: React.ReactNode;
  title: string;
  para: string;
  step: number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ svg, title, para, step }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex  flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* actual card */}
      <div className="rounded-lg bg-white p-6 max-w-xs text-center relative overflow-hidden border border-[#2a2a2a] shadow-lg hover:-translate-y-4 transition-all duration-300 hover:duration-200 ease-[cubic-bezier(0.4,1.3,0.2,0.9)] hover:shadow-[0_10px_25px_-5px_rgba(59,130,146,0.4)]">
        <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
          {svg}
        </div>
        <h3 className=" font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{para}</p>
      </div>

      {/* number shown under the card */}
      <div
        className={`mt-3 font-bold text-xl transition-all duration-300 ${
          isHovered
            ? "opacity-100 translate-y-3"
            : "opacity-0 translate-y-0 pointer-events-none"
        }`}
      >
        {step}.
      </div>
    </div>
  );
};
