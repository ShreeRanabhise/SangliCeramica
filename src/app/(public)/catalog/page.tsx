import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { CatalogClient } from "@/components/public/catalog-client";

export const metadata: Metadata = {
  title: "Product Catalog | Sangli Ceramica",
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
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Product Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
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
