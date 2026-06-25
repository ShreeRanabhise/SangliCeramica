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
}

export const ProductClient: React.FC<ProductClientProps> = ({ data, categories, brands }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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
      <ProductTable data={data} onEdit={handleEdit} />
    </>
  );
};
