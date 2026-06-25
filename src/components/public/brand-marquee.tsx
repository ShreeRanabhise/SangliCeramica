"use client";

import Image from "next/image";

export function BrandMarquee({ brands }: { brands: any[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden border-t">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Trusted Partner Brands</h2>
      </div>
      <div className="relative flex overflow-hidden w-full group">
        <div className="animate-marquee flex whitespace-nowrap items-center group-hover:[animation-play-state:paused]">
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="mx-12 shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
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
