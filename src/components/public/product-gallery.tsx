"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface ProductGalleryProps {
  images: any[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[3/2] bg-muted rounded-2xl flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-white border">
        <Image 
          src={activeImage.url} 
          alt={`${productName} - Image ${activeIndex + 1}`} 
          fill 
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-[3/2] rounded-lg overflow-hidden border-2 transition-all bg-white",
                activeIndex === index ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              <Image 
                src={image.url} 
                alt={`${productName} thumbnail ${index + 1}`} 
                fill 
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
