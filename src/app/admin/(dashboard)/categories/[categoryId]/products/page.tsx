import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getBrands } from "@/actions/brands";
import { ProductClient } from "@/app/admin/(dashboard)/products/components/product-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Category Products | Sangli Ceramica Admin",
};

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  if (!productsRes.success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load products.</p>
      </div>
    );
  }

  // Find category to display its name
  const category = categoriesRes.data?.find((c: any) => c.id === categoryId);
  
  // Filter products by categoryId
  const filteredProducts = productsRes.data?.filter((p: any) => p.categoryId === categoryId) || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-4">
        {category && (
          <Link href={`/admin/collections/${category.collection.toLowerCase()}/categories`} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <h2 className="text-2xl font-bold tracking-tight">{category?.name || "Category"} Products</h2>
      </div>

      <ProductClient 
        data={filteredProducts} 
        categories={categoriesRes.data || []}
        brands={brandsRes.data || []}
        defaultCategory={categoryId}
        defaultCollection={category?.collection}
      />
    </div>
  );
}
