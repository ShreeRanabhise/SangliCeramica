import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { CatalogClient } from "@/components/public/catalog-client";

export const metadata: Metadata = {
  title: "Products | Sangli Ceramica",
  description: "Browse our extensive collection of premium tiles, sanitaryware, and doors.",
};

export default async function CatalogPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [productsRes, categoriesRes, searchParams] = await Promise.all([
    getProducts(),
    getCategories(),
    props.searchParams
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined;
  let collectionId: string | undefined = undefined;
  if (categoryId && categories) {
    const matchedCategory = categories.find((c: any) => c.id === categoryId);
    if (matchedCategory) {
      collectionId = matchedCategory.collection;
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        
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
          initialCategory={categoryId}
          initialCollection={collectionId}
        />

      </div>
    </div>
  );
}
