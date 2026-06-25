"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BrandForm } from "./brand-form";
import { BrandTable } from "./brand-table";

interface BrandClientProps {
  data: any[];
}

export const BrandClient: React.FC<BrandClientProps> = ({ data }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);

  const handleCreateNew = () => {
    setSelectedBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedBrand(null);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-4">
        <BrandForm initialData={selectedBrand} onClose={handleClose} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-sm text-muted-foreground">
            Manage product brands for your store
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <hr className="my-4" />
      <BrandTable data={data} onEdit={handleEdit} />
    </>
  );
};
