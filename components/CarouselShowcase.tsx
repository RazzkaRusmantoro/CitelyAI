"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/scarousel";
import Image from "next/image";
import { motion } from "framer-motion";

interface CarouselShowcaseProps {
  className?: string;
}

export function CarouselShowcase({ className }: CarouselShowcaseProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();

  const steps = [
    {
      title: "Automated Citations",
      description:
        "Quickly generate and validate academic references for your papers with accuracy and ease.",
      image: "/ss1.png",
    },
    {
      title: "Source Verification",
      description:
        "Instantly verify the authenticity of any source.",
      image: "/ss2.png",
    },
    {
      title: "Citation Management",
      description:
        "Format and organize citations in multiple academic styles automatically.",
      image: "/ss3.png",
    },
  ];

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    api?.scrollTo(index);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Step Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer transition-all duration-300 p-6 rounded-xl 
                ${
                currentSlide === index
                    ? "bg-amber-500 text-white shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
            onClick={() => scrollToSlide(index)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            >
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
            </motion.div>
        ))}
      </div>

      {/* Carousel Container - Increased height by 50% */}
      <div className="relative bg-neutral-100 rounded-2xl shadow-inner h-[600px] flex items-center">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="-ml-2 -mr-2">
            {steps.map((step, index) => (
              <CarouselItem
                key={index}
                className={`basis-[70%] flex items-center justify-center pl-2 pr-2 ${
                  index === 0 ? "!pl-10" : index === steps.length - 1 ? "!pr-10" : ""
                }`}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentSlide === index ? 1.1 : 1,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={2560}
                      height={1440}
                      className="object-contain max-h-[750px] py-20 px-7 w-auto mx-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.2)] rounded-lg"
                    />
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}