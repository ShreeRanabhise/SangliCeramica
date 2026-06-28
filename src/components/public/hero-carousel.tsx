"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface HeroCarouselProps {
  images: string[];
  title: string;
  subtitle: string;
}

export function HeroCarousel({ images, title, subtitle }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  // Fallback image if no images provided
  const backgroundImages = images && images.length > 0 
    ? images 
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"];

  return (
    <section className="relative w-full aspect-[5/2] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/40 z-10" />
      
      {backgroundImages.map((src, index) => (
        <div 
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      
      <div className="container relative z-20 mx-auto px-4 text-center mt-4 md:mt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-medium mb-2 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Premium Showroom Experience</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 animate-fade-in-up [animation-delay:200ms]">
          {title ? (
            <div dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} />
          ) : (
            <>
              Elevate Your <br className="hidden md:block" />
              <span className="text-primary italic">Living Spaces</span>
            </>
          )}
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in-up [animation-delay:400ms]">
          {subtitle || "Discover Sangli's most exclusive collection of luxury tiles, elegant sanitaryware, and premium designer doors."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
          <Link href="/collections" className={buttonVariants({ size: "lg", className: "rounded-full px-6 w-full sm:w-auto" })}>
            Explore Collection
          </Link>
          <Link href="/showrooms" className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full px-6 w-full sm:w-auto bg-white/10 text-white hover:bg-white hover:text-black border-white/30 backdrop-blur-sm" })}>
            Visit Showroom
          </Link>
        </div>
      </div>
    </section>
  );
}
