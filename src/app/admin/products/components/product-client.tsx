"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductTable } from "./product-table";

interface ProductClientProps {
  data: any[];
  categories: any[];
  brands: any[];
  defaultCategory?: string;
  defaultCollection?: string;
}

export const ProductClient: React.FC<ProductClientProps> = ({ data, categories, brands, defaultCategory, defaultCollection }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(defaultCollection || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategory || null);

  const filteredCategories = selectedCollection 
    ? categories.filter(c => c.collection === selectedCollection)
    : categories;

  const filteredProducts = data.filter((p) => {
    const matchesCollection = selectedCollection ? p.category?.collection === selectedCollection : true;
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesCollection && matchesCategory;
  });

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-4">
        <ProductForm 
          initialData={selectedProduct} 
          categories={categories} 
          brands={brands} 
          onClose={handleClose} 
          defaultCategory={defaultCategory}
          defaultCollection={defaultCollection}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your inventory, specifications, and galleries
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <hr className="my-4" />
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          className="h-9 rounded-md border bg-transparent px-3 text-sm shadow-sm"
          value={selectedCollection || ""}
          onChange={(e) => {
            setSelectedCollection(e.target.value || null);
            setSelectedCategory(null);
          }}
        >
          <option value="">All Collections</option>
          <option value="TILES">Tiles</option>
          <option value="SANITARYWARE">Sanitaryware</option>
          <option value="DOORS">Doors</option>
        </select>

        <select 
          className="h-9 rounded-md border bg-transparent px-3 text-sm shadow-sm"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          disabled={!selectedCollection && filteredCategories.length === 0}
        >
          <option value="">All Categories</option>
          {filteredCategories.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <ProductTable data={filteredProducts} onEdit={handleEdit} />
    </>
  );
};
