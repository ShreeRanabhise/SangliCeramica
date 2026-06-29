"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BranchForm } from "./branch-form";
import { BranchTable } from "./branch-table";

interface BranchClientProps {
  data: any[];
}

export const BranchClient: React.FC<BranchClientProps> = ({ data }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);

  const handleCreateNew = () => {
    setSelectedBranch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: any) => {
    setSelectedBranch(branch);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedBranch(null);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-4">
        <BranchForm initialData={selectedBranch} onClose={handleClose} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <p className="text-sm text-muted-foreground">
            Manage physical showroom locations
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Branch
        </Button>
      </div>
      <hr className="my-4" />
      <BranchTable data={data} onEdit={handleEdit} />
    </>
  );
};
