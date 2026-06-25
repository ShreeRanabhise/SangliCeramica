import { Metadata } from "next";
import { getCarouselImages } from "@/actions/carousel";
import { CarouselClient } from "./components/carousel-client";

export const metadata: Metadata = {
  title: "Carousel | Sangli Ceramica Admin",
};

export default async function CarouselPage() {
  const { data: carouselImages, success, error } = await getCarouselImages();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load carousel images: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CarouselClient data={carouselImages || []} />
    </div>
  );
}
