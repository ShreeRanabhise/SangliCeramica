import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { CatalogClient } from "@/components/public/catalog-client";

export const metadata: Metadata = {
  title: "Products | Sangli Ceramica",
  description: "Browse our extensive collection of premium tiles, sanitaryware, and doors.",
};

export default async function CatalogPage() {
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 relative overflow-hidden rounded-3xl bg-card border shadow-sm flex flex-col justify-center p-6 md:p-12">
          {/* Subtle gradient backgrounds */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
              Products
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-medium">
              Explore our comprehensive range of high-quality ceramics, elegant sanitary fittings, and premium designer doors. Use the filters to find exactly what you're looking for.
            </p>
          </div>
        </div>

        {/* Catalog Client (Filters + Grid) */}
        <CatalogClient 
          products={products || []} 
          categories={categories || []}
        />

      </div>
    </div>
  );
}
