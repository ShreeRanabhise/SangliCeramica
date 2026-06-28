"use client";

import Image from "next/image";

export function BrandMarquee({ brands }: { brands: any[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-4 bg-white overflow-hidden border-t">
      <div className="relative flex overflow-hidden w-full flex-col justify-center items-center group">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] gap-12 md:gap-20 items-center justify-center px-6">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity min-w-[150px]">
              {brand.logo ? (
                <Image 
                  src={brand.logo} 
                  alt={brand.name} 
                  width={150} 
                  height={80} 
                  className="object-contain h-16 w-auto"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-400">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
