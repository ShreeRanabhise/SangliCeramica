import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="z-20 text-center text-primary-foreground max-w-4xl px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Elevate Your Living Space
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
            Discover premium tiles, elegant sanitaryware, and modern doors designed for luxury and durability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
            <Link href="/products" className={buttonVariants({ variant: "default", size: "lg", className: "text-lg px-8 h-14 bg-accent text-accent-foreground hover:bg-accent/90" })}>
              Explore Collections
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-8 h-14 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" })}>
              Visit Showroom
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Shell */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Categories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated selections to bring your architectural vision to life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tiles Category */}
            <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-muted flex items-end p-8 transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">Luxury Tiles</h3>
                <Link href="/products/tiles" className="text-white/80 hover:text-white hover:underline underline-offset-4 inline-flex items-center">
                  View Collection <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
            
            {/* Sanitaryware Category */}
            <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-muted flex items-end p-8 transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">Sanitaryware</h3>
                <Link href="/products/sanitaryware" className="text-white/80 hover:text-white hover:underline underline-offset-4 inline-flex items-center">
                  View Collection <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Doors Category */}
            <div className="group relative h-[400px] rounded-2xl overflow-hidden bg-muted flex items-end p-8 transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">Premium Doors</h3>
                <Link href="/products/doors" className="text-white/80 hover:text-white hover:underline underline-offset-4 inline-flex items-center">
                  View Collection <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
