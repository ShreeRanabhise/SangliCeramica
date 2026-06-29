import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/product-gallery";
import { buttonVariants } from "@/components/ui/button";
import { MessageSquare, ShieldCheck, Truck, BadgeCheck, Handshake } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Sangli Ceramica`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug, isDeleted: false },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Generate a WhatsApp inquiry message
  const inquiryMessage = encodeURIComponent(`Hello Sangli Ceramica, I am interested in the product: ${product.name}. Could you provide more details?`);
  const whatsappUrl = `https://wa.me/919876543210?text=${inquiryMessage}`;

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-wider font-semibold">
                {product.brand?.name || product.category?.name}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{product.name}</h1>

            <div className="grid grid-cols-1 gap-4 mb-8 bg-muted/30 p-4 rounded-xl border border-border/50 max-w-sm">
              {product.size && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Size</div>
                  <div className="font-medium">{product.size}</div>
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 mb-8 border flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                  <span>Genuine Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-primary" />
                  <span>Trusted Partners</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "w-full sm:flex-1 h-14 text-base" })}>
                <MessageSquare className="mr-2 w-5 h-5" />
                Inquire on WhatsApp
              </a>
              <Link href="/showrooms" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:flex-1 h-14 text-base" })}>
                Visit Showroom
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
