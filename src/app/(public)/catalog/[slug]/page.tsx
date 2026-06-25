import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/product-gallery";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, MessageSquare, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Sangli Ceramica`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug, isDeleted: false },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Parse specifications
  const specs = product.specifications as Record<string, string>;
  const hasSpecs = specs && Object.keys(specs).length > 0;

  // Generate a WhatsApp inquiry message
  const inquiryMessage = encodeURIComponent(`Hello Sangli Ceramica, I am interested in the product: ${product.name} (SKU: ${product.sku}). Could you provide more details?`);
  const whatsappUrl = `https://wa.me/919876543210?text=${inquiryMessage}`;

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
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
              <span className="px-3 py-1 bg-muted text-foreground text-xs font-semibold uppercase tracking-wider rounded-full">
                {product.category.name}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-6">SKU: {product.sku}</p>

            <div className="prose prose-slate dark:prose-invert mb-8">
              <p className="text-lg leading-relaxed text-foreground/80">{product.description}</p>
            </div>

            {/* Features (if any) */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-muted/50 rounded-2xl p-6 mb-8 border flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Safe Delivery</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "w-full sm:flex-1 h-14 text-base" })}>
                <MessageSquare className="mr-2 w-5 h-5" />
                Inquire on WhatsApp
              </a>
              <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:flex-1 h-14 text-base" })}>
                Visit Showroom
              </Link>
            </div>

          </div>
        </div>

        {/* Specifications Section */}
        {hasSpecs && (
          <div className="mt-24 border-t pt-16">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border/50">
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="font-semibold text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
