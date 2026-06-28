import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CollectionName } from "@prisma/client";

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { collection } = await params;
  const enumValue = collection.toUpperCase() as CollectionName;
  
  if (!Object.values(CollectionName).includes(enumValue)) {
    return { title: "Collection Not Found" };
  }

  const meta = await prisma.collectionMeta.findUnique({
    where: { collection: enumValue },
  });

  return {
    title: `${meta?.title || collection} | Sangli Ceramica`,
    description: meta?.tagline || `Explore our ${collection} collection.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const enumValue = collection.toUpperCase() as CollectionName;
  
  // Validate collection name
  if (!Object.values(CollectionName).includes(enumValue)) {
    notFound();
  }

  // Fetch Collection Meta
  const meta = await prisma.collectionMeta.findUnique({
    where: { collection: enumValue },
  });

  // Fetch Categories for this Collection
  const categories = await prisma.category.findMany({
    where: { collection: enumValue },
    orderBy: { name: "asc" },
  });

  // Fetch all Products for this Collection
  const allProducts = await prisma.product.findMany({
    where: { 
      category: { collection: enumValue },
      isDeleted: false,
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      },
    },
  });

  // Shuffle products randomly
  const randomizedProducts = [...allProducts].sort(() => 0.5 - Math.random());

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-12 mt-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {meta?.title || enumValue}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            {meta?.tagline || `Discover our exclusive range of ${enumValue.toLowerCase()}.`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        
        {/* Categories Grid */}
        {categories.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
              <Link href="/catalog" className="text-primary font-medium hover:underline">
                View all products &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/catalog?category=${cat.id}`}
                  className="group relative h-48 rounded-2xl overflow-hidden block border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  {cat.icon ? (
                    <Image 
                      src={cat.icon} 
                      alt={cat.name} 
                      fill 
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
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Randomized Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured {meta?.title || enumValue}</h2>
          </div>

          {randomizedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We are currently adding more products to this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {randomizedProducts.map((product) => {
                const primaryImage = product.images?.[0]; // We filtered for isPrimary in the query
                return (
                  <Link key={product.id} href={`/catalog/${product.slug}`} className="group block">
                    <div className="bg-card rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        {primaryImage ? (
                          <Image 
                            src={primaryImage.url} 
                            alt={product.name} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{product.category?.name}</p>
                        <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                        {product.size && (
                          <p className="text-xs text-muted-foreground mt-1">Size: {product.size}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
