import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getBrands } from "@/actions/brands";
import { ProductClient } from "./components/product-client";

export const metadata: Metadata = {
  title: "Product Management | Sangli Ceramica Admin",
};

export default async function ProductsPage() {
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  if (!productsRes.success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load products: {productsRes.error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductClient 
        data={productsRes.data || []} 
        categories={categoriesRes.data || []}
        brands={brandsRes.data || []}
      />
    </div>
  );
}
