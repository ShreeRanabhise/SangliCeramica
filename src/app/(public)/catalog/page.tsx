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
        <div className="mb-8 md:mb-12 max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Products
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-medium">
            Explore our comprehensive range of high-quality ceramics, elegant sanitary fittings, and premium designer doors. Use the filters to find exactly what you're looking for.
          </p>
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
