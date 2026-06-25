import { getCollections } from "@/actions/collections";
import { getProducts } from "@/actions/products";
import { getBrands } from "@/actions/brands";
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
  const featuredProducts = allProducts?.filter((p: any) => p.isFeatured).slice(0, 4) || [];
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
        <div className="w-full h-[50vh] md:h-[60vh] bg-slate-900 flex items-center justify-center">
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
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore by Collection</h2>
                <p className="text-muted-foreground text-lg">Browse our meticulously curated collections designed to inspire your next architectural project.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((col: any) => (
                <Link 
                  key={col.id} 
                  href={`/collections/${col.collection.toLowerCase()}`}
                  className="group relative h-[400px] rounded-2xl overflow-hidden block"
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
                    <div className="mt-4 inline-flex items-center text-primary text-sm font-semibold opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      View Collection <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catalogues Download Section (Moved up) */}
      {catalogues.length > 0 && (
        <section className="py-12 md:py-20 bg-muted/80 border-y">
          <div className="container mx-auto px-4">
            <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Download Our Catalogues</h2>
                  <p className="text-muted-foreground text-lg">Browse our complete range of products, specifications, and design inspirations offline by downloading our premium PDF catalogues.</p>
                </div>
                
                <CatalogueDownloadForm catalogues={catalogues} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-24 bg-muted/50 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Signature Pieces</h2>
              <p className="text-muted-foreground text-lg">Our most requested and highly rated products, handpicked by our design experts.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product: any) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                return (
                  <Link key={product.id} href={`/catalog/${product.slug}`} className="group block">
                    <div className="bg-card rounded-2xl overflow-hidden border shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative aspect-[4/5] bg-muted overflow-hidden">
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
                        <p className="text-sm text-muted-foreground mb-1">{product.category?.name}</p>
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/catalog" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8" })}>
                View All Products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. Gallery / Showroom Glimpse Section */}
      {gallery.length > 0 && (
        <section className="py-12 md:py-24 bg-background border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div className="max-w-xl mb-6 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Showroom Glimpse</h2>
                <p className="text-muted-foreground text-lg">A peek into our luxurious Sangli showroom and recent installations.</p>
              </div>
              <Link href="/gallery" className={buttonVariants({ variant: "outline" })}>
                View Full Gallery <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((media: any) => (
                <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden group">
                  <Image 
                    src={media.url} 
                    alt="Showroom Gallery" 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">Experience it in person</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Pictures don't do justice to the textures and finishes of our premium ceramics. Visit our Sangli showroom to feel the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className={buttonVariants({ size: "lg", variant: "secondary", className: "rounded-full px-8 w-full sm:w-auto" })}>
              <MapPin className="mr-2 h-4 w-4" />
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
