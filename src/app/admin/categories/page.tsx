import { Metadata } from "next";
import { getCategories } from "@/actions/categories";
import { CategoryClient } from "./components/category-client";

export const metadata: Metadata = {
  title: "Category Management | Sangli Ceramica Admin",
};

export default async function CategoriesPage() {
  const { data: categories, success, error } = await getCategories();

  if (!success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load categories: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CategoryClient data={categories || []} />
    </div>
  );
}
