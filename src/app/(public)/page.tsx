import { getCollections } from "@/actions/collections";
import { getProducts } from "@/actions/products";
import { getBrands } from "@/actions/brands";
import { NavCard } from "@/components/ui/nav-card";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { BrandMarquee } from "@/components/public/brand-marquee";
import { CatalogueDownloadForm } from "@/components/public/catalogue-download-form";

export const metadata = {
  title: "Sangli Ceramica | Premium Tiles & Sanitaryware Showroom",
  description: "Explore our exclusive collection of luxury tiles, elegant sanitaryware, and premium doors. Transform your spaces with Sangli Ceramica.",
};

export default async function HomePage() {
  // Fetch data on the server concurrently
  const [colRes, prodRes, brandRes, carouselRes, categories, catalogues, gallery] = await Promise.all([
    getCollections(),
    getProducts(),
    getBrands(),
    prisma.carouselImage.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.catalogue.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    prisma.galleryMedia.findMany({ take: 6, orderBy: { order: "asc" } })
  ]);

  const collections = colRes.success ? colRes.data : [];
  const allProducts = prodRes.success ? prodRes.data : [];
  const featuredProducts = allProducts?.slice(0, 4) || [];
  const brands = brandRes.success ? brandRes.data : [];
  
  // Format carousel images for HeroCarousel component
  // We use the first image's title/subtitle as fallback if HeroCarousel only supports global title
  // Currently HeroCarousel just takes arrays of strings and a global title. We can upgrade it later if needed,
  // but for now we'll pass the images array.
  const carouselImageUrls = carouselRes.map(img => img.imageUrl);
  const mainTitle = carouselRes[0]?.title || "The Pinnacle of Elegance";
  const mainSubtitle = carouselRes[0]?.subtitle || "Discover Sangli's most exclusive collection.";

  return (
    <>
      {/* 1. Carousel Section */}
      {carouselImageUrls.length > 0 ? (
        <HeroCarousel 
          images={carouselImageUrls}
          title={mainTitle}
          subtitle={mainSubtitle}
        />
      ) : (
        <div className="w-full min-h-[80vh] md:min-h-[600px] md:aspect-[5/2] bg-slate-900 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{mainTitle}</h1>
            <p className="text-base md:text-lg text-slate-300">{mainSubtitle}</p>
          </div>
        </div>
      )}

      {/* 2. Brands Section */}
      <BrandMarquee brands={brands || []} />

      {/* 4. Collections Section */}
      {collections && collections.length > 0 && (
        <section className="py-4 md:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-4">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore by Collection</h2>
                <p className="text-muted-foreground text-lg">Browse our meticulously curated collections designed to inspire your next architectural project.</p>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:mx-0 md:px-0 md:overflow-visible no-scrollbar">
              {collections.map((col: any) => (
                <NavCard 
                  key={col.id} 
                  href={`/collections/${col.collection.toLowerCase()}`}
                  className="group relative aspect-[3/2] rounded-2xl overflow-hidden block shrink-0 w-[85vw] snap-center mr-4 md:w-auto md:mr-0 last:mr-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  {col.imageUrl ? (
                    <Image 
                      src={col.imageUrl} 
                      alt={col.title}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-slate-800" />
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{col.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{col.tagline}</p>
                  </div>
                </NavCard>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* 5. Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-4 md:py-8 bg-muted/50 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Signature Pieces</h2>
              <p className="text-muted-foreground text-lg">Our most requested and highly rated products, handpicked by our design experts.</p>
            </div>

            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 md:mx-0 md:px-0 md:overflow-visible no-scrollbar">
              {featuredProducts.map((product: any) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                return (
                  <NavCard key={product.id} href={`/products/${product.slug}`} className="group block rounded-2xl shrink-0 w-[70vw] snap-center mr-4 md:w-auto md:mr-0 last:mr-0">
                    <div className="bg-card rounded-2xl overflow-hidden border shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative aspect-[3/2] bg-muted overflow-hidden">
                        {primaryImage ? (
                          <Image 
                            src={primaryImage.url} 
                            alt={product.name} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-1">
                          {product.brand?.name || product.category?.name}
                        </p>
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.size}</p>
                      </div>
                    </div>
                  </NavCard>
                )
              })}
            </div>
            
            <div className="mt-6 text-center">
              <NavCard href="/products" className="inline-block">
                <div className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 pointer-events-none" })}>
                  View All Products <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </NavCard>
            </div>
          </div>
        </section>
      )}

      {/* Catalogues Download Section */}
      {catalogues.length > 0 && (
        <section id="catalogues" className="py-16 md:py-24 bg-primary/5 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Download Our Catalogues</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Browse our complete range of products, specifications, and design inspirations offline by downloading our premium PDF catalogues.
                </p>
              </div>
              <Link href="/catalogues" className={buttonVariants({ variant: "outline", className: "shrink-0 hidden md:inline-flex" })}>
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {catalogues.slice(0, 3).map((catalogue: any) => (
                <div key={catalogue.id} className="h-full">
                  <CatalogueDownloadForm catalogue={catalogue} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 md:hidden text-center">
              <Link href="/catalogues" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                View All Catalogues <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Experience it in person</h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
              Pictures don't do justice to the textures and finishes of our premium ceramics. Visit our Sangli showroom to feel the difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/showrooms" className={buttonVariants({ size: "lg", className: "px-8 w-full sm:w-auto" })}>
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
