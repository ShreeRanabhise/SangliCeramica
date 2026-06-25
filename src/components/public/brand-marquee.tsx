"use client";

import Image from "next/image";

export function BrandMarquee({ brands }: { brands: any[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden border-t">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Trusted Partner Brands</h2>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
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
