"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryForm } from "./category-form";
import { CategoryTable } from "./category-table";

interface CategoryClientProps {
  data: any[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

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
        <CategoryForm initialData={selectedCategory} onClose={handleClose} />
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
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <hr className="my-4" />
      <CategoryTable data={data} onEdit={handleEdit} />
    </>
  );
};
