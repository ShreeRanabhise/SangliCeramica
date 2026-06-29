import { Metadata } from "next";
import { getCategories } from "@/actions/categories";
import { CategoryClient } from "@/app/admin/(dashboard)/categories/components/category-client";
import { CollectionName } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Collection Categories | Sangli Ceramica Admin",
};

export default async function CollectionCategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const colName = id.toUpperCase() as CollectionName;
  const res = await getCategories();

  if (!res.success) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive font-medium">Failed to load categories: {res.error}</p>
      </div>
    );
  }

  // Filter categories by the collection in the URL
  const filteredCategories = res.data?.filter(c => c.collection === colName) || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/collections" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight capitalize">{id} Categories</h2>
      </div>
      
      {/* We pass the filtered data to CategoryClient, which uses CategoryTable */}
      <CategoryClient data={filteredCategories} defaultCollection={colName} />
    </div>
  );
}
