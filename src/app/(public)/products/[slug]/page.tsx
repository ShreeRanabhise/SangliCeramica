import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/product-gallery";
import { buttonVariants } from "@/components/ui/button";
import { MessageSquare, ShieldCheck, BadgeCheck, Handshake } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({ 
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { order: "asc" } }
      }
    });
  } catch (error) {
    console.warn("Product generateMetadata: DB error during prerender", error);
  }
  
  if (!product) return { title: "Product | Sangli Ceramica" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sangliceramica.com";
  const primaryImg = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url;
  const description = `Explore ${product.name}${product.size ? ` (Size: ${product.size})` : ''}${product.brand ? ` by ${product.brand.name}` : ''} under ${product.category?.name || 'Products'} at Sangli Ceramica.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Sangli Ceramica`,
      description,
      url: `/products/${product.slug}`,
      images: primaryImg ? [{ url: primaryImg, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Sangli Ceramica`,
      description,
      images: primaryImg ? [primaryImg] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug, isDeleted: false },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: "asc" }
        }
      }
    });
  } catch (error) {
    console.warn("ProductPage: DB query error during prerender", error);
  }

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sangliceramica.com";

  // Generate a WhatsApp inquiry message
  const inquiryMessage = encodeURIComponent(`Hello Sangli Ceramica, I am interested in the product: ${product.name}. Could you provide more details?`);
  const whatsappUrl = `https://wa.me/919876543210?text=${inquiryMessage}`;

  // Structured Data (JSON-LD)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img: any) => img.url) || [],
    "description": `${product.name} ${product.size ? `Size: ${product.size}` : ''}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Sangli Ceramica",
    },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Sangli Ceramica"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${baseUrl}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category?.name || "Category",
        "item": `${baseUrl}/products?category=${product.category?.id}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `${baseUrl}/products/${product.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.id}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              {product.brand && (
                <span className="inline-block px-3 py-1 rounded-full bg-background border text-foreground shadow-sm text-xs uppercase tracking-wider font-semibold">
                  {product.brand.name}
                </span>
              )}
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {product.category?.name}
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
