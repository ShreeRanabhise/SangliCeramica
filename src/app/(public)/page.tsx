import { getCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

export const metadata = {
  title: "Sangli Ceramica | Premium Tiles & Sanitaryware Showroom",
  description: "Explore our exclusive collection of luxury tiles, elegant sanitaryware, and premium doors. Transform your spaces with Sangli Ceramica.",
};

export default async function HomePage() {
  // Fetch data on the server
  const [catRes, prodRes] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  const categories = catRes.success ? catRes.data : [];
  // Filter for featured products (up to 4)
  const allProducts = prodRes.success ? prodRes.data : [];
  const featuredProducts = allProducts?.filter((p: any) => p.isFeatured).slice(0, 4) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/40 z-10" />
        {/* We would use a real image here, using a sophisticated placeholder for now */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Premium Showroom Experience</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 animate-fade-in-up [animation-delay:200ms]">
            Elevate Your <br className="hidden md:block" />
            <span className="text-primary italic">Living Spaces</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:400ms]">
            Discover Sangli's most exclusive collection of luxury tiles, elegant sanitaryware, and premium designer doors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
            <Button size="lg" className="rounded-full px-8 w-full sm:w-auto" asChild>
              <Link href="/catalog">Explore Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto bg-white/10 text-white hover:bg-white hover:text-black border-white/30 backdrop-blur-sm" asChild>
              <Link href="/contact">Visit Showroom</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Shop by Category</h2>
                <p className="text-muted-foreground text-lg">Browse our meticulously curated collections designed to inspire your next architectural project.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.slice(0, 3).map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/catalog?category=${category.slug}`}
                  className="group relative h-[400px] rounded-2xl overflow-hidden block"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  {category.icon ? (
                    <Image 
                      src={category.icon} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-muted/50 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Signature Pieces</h2>
              <p className="text-muted-foreground text-lg">Our most requested and highly rated products, handpicked by our design experts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          {product.brand && (
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-md shadow-sm">
                              {product.brand.name}
                            </span>
                          )}
                        </div>
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
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href="/catalog">View Full Catalog <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Experience it in person</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Pictures don't do justice to the textures and finishes of our premium ceramics. Visit our Sangli showroom to feel the difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="rounded-full px-8 w-full sm:w-auto" asChild>
              <Link href="/contact">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
