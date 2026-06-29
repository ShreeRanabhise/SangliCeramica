"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { CategoryForm } from "./category-form";
import { CategoryTable } from "./category-table";

interface CategoryClientProps {
  data: any[];
  defaultCollection?: string;
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data, defaultCollection }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [filterCollection, setFilterCollection] = useState<string>("ALL");

  const filteredData = useMemo(() => {
    if (filterCollection === "ALL") return data;
    return data.filter(c => c.collection === filterCollection);
  }, [data, filterCollection]);

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-4">
        <CategoryForm initialData={selectedCategory} onClose={handleClose} defaultCollection={defaultCollection} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage product categories for your store
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Collections</option>
              <option value="TILES">Tiles</option>
              <option value="SANITARYWARE">Sanitaryware</option>
              <option value="DOORS">Doors</option>
            </select>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      <hr className="my-4" />
      <CategoryTable data={filteredData} onEdit={handleEdit} />
    </>
  );
};
