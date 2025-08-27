"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { IconDotsVertical, IconX, IconCheck, IconPencil } from "@tabler/icons-react";

interface CompareProps {
  beforeText?: string;
  afterText?: string;
  className?: string;
  beforeClassName?: string;
  afterClassName?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
}

export const TextCompare = ({
  beforeText = "",
  afterText = "",
  className,
  beforeClassName,
  afterClassName,
  initialSliderPercentage = 50,
  slideMode = "hover",
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Highlight all citations in the text
  const highlightCitations = useCallback((text: string) => {
    // Split text while keeping the citation markers
    const parts = text.split(/(\([^)]+\))/g);
    
    return parts.map((part, index) => {
      // Check for citation pattern (text in parentheses)
      if (part.match(/\([^)]+\)/)) {
        return (
          <span 
            key={index} 
            className="relative inline-block group"
          >
            <span className="bg-amber-100 px-1 rounded-md border border-amber-200">
              {part}
            </span>
            {/* Static popup - always visible */}
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-md p-2 flex gap-2 z-50">
              <div className="p-1 text-blue-600">
                <IconPencil className="w-4 h-4" />
              </div>
              <div className="p-1 text-green-600">
                <IconCheck className="w-4 h-4" />
              </div>
              <div className="p-1 text-red-600">
                <IconX className="w-4 h-4" />
              </div>
            </div>
          </span>
        );
      }
      return part;
    });
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSliderXPercent(percent);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
      handleMove(e.clientX);
    }
  }, [slideMode, isDragging, handleMove]);

  return (
    <div
      ref={sliderRef}
      className={cn(
        "w-full h-auto min-h-[400px] relative bg-white rounded-xl overflow-hidden shadow-lg",
        className
      )}
      style={{
        cursor: slideMode === "drag" ? (isDragging ? "grabbing" : "grab") : "col-resize",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => slideMode === "hover" && setSliderXPercent(50)}
      onMouseDown={() => slideMode === "drag" && setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* Before text (left side) */}
      <div
        className={cn(
          "absolute inset-0 p-8 bg-white rounded-xl w-full h-full select-none overflow-y-auto",
          beforeClassName
        )}
        style={{
          clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
        }}
      >
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Without Citera
          </h3>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            {beforeText.split("\n\n").map((paragraph, i) => (
              <div key={i} className="text-justify">
                {paragraph}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* After text (right side) */}
      <div
        className={cn(
          "absolute inset-0 p-8 bg-gray-50 rounded-xl w-full h-full select-none overflow-y-auto",
          afterClassName
        )}
        style={{
          clipPath: `inset(0 0 0 ${sliderXPercent}%)`,
        }}
      >
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            With Citera
          </h3>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            {afterText.split("\n\n").map((paragraph, i) => (
              <div key={i} className="text-justify">
                {highlightCitations(paragraph)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 h-full w-1 bg-indigo-500 z-30"
        style={{
          left: `${sliderXPercent}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 bg-white rounded-md p-1 shadow-md">
          <IconDotsVertical className="h-4 w-4 text-black" />
        </div>
      </div>
    </div>
  );
};