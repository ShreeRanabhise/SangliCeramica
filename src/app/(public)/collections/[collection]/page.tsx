import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { NavCard } from "@/components/ui/nav-card";
import Link from "next/link";
import { CollectionName } from "@prisma/client";
import { BackButton } from "@/components/ui/back-button";
import { Metadata } from "next";

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const enumValue = collection.toUpperCase() as CollectionName;
  
  if (!Object.values(CollectionName).includes(enumValue)) {
    return { title: "Collection Not Found" };
  }

  let meta: any = null;
  try {
    meta = await prisma.collectionMeta.findUnique({
      where: { collection: enumValue },
    });
  } catch (error) {
    console.warn("Collection generateMetadata: DB error during prerender", error);
  }

  const title = meta?.title || `${collection.charAt(0).toUpperCase() + collection.slice(1)} Collection`;
  const description = meta?.tagline || `Discover our exclusive range of luxury ${collection} at Sangli Ceramica.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/collections/${collection.toLowerCase()}`,
    },
    openGraph: {
      title: `${title} | Sangli Ceramica`,
      description,
      url: `/collections/${collection.toLowerCase()}`,
      images: meta?.imageUrl ? [{ url: meta.imageUrl, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Sangli Ceramica`,
      description,
      images: meta?.imageUrl ? [meta.imageUrl] : [],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const enumValue = collection.toUpperCase() as CollectionName;
  
  // Validate collection name
  if (!Object.values(CollectionName).includes(enumValue)) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sangliceramica.com";

  let meta: any = null;
  let categories: any[] = [];
  let allProducts: any[] = [];

  try {
    const res = await Promise.all([
      prisma.collectionMeta.findUnique({
        where: { collection: enumValue },
      }),
      prisma.category.findMany({
        where: { collection: enumValue },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { 
          category: { collection: enumValue },
          isDeleted: false,
        },
        take: 24, // Limit to top 24 products for performance
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1
          },
        },
      })
    ]);
    meta = res[0];
    categories = res[1];
    allProducts = res[2];
  } catch (error) {
    console.warn("CollectionPage: DB query error during prerender", error);
  }

  const title = meta?.title || enumValue;

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
        "name": "Collections",
        "item": `${baseUrl}/collections`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${baseUrl}/collections/${collection.toLowerCase()}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 mb-12 mt-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            {meta?.tagline || `Discover our exclusive range of ${enumValue.toLowerCase()}.`}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        
        {/* Categories Grid */}
        {categories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
              <Link href="/products" className="text-primary font-medium hover:underline">
                View all products &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <NavCard 
                  key={cat.id} 
                  href={`/products?category=${cat.id}`}
                  className="group relative aspect-[3/2] rounded-2xl overflow-hidden block border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  {cat.icon ? (
                    <Image 
                      src={cat.icon} 
                      alt={cat.name} 
                      fill 
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20 pr-4">
                    <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  </div>
                </NavCard>
              ))}
            </div>
          </div>
        )}

        {/* Featured Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured {title}</h2>
          </div>

          {allProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We are currently adding more products to this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product) => {
                const primaryImage = product.images?.[0];
                return (
                  <NavCard key={product.id} href={`/products/${product.slug}`} className="group block">
                    <div className="bg-secondary rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="relative aspect-[3/2] bg-white overflow-hidden">
                        {primaryImage ? (
                          <Image 
                            src={primaryImage.url} 
                            alt={product.name} 
                            fill 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>
                        )}
                        
                        {product.brand && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-block px-2 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground shadow-sm text-[10px] uppercase tracking-wider font-semibold">
                              {product.brand.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.category?.name || "Product"}
                        </p>
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{product.name}</h3>
                        {product.size && (
                          <p className="text-xs text-muted-foreground mt-1">Size: {product.size}</p>
                        )}
                      </div>
                    </div>
                  </NavCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
