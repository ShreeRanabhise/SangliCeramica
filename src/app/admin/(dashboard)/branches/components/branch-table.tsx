"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Star, MapPin } from "lucide-react";
import { deleteBranch, setPrimaryBranch } from "@/actions/branches";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface BranchTableProps {
  data: any[];
  onEdit: (branch: any) => void;
}

export const BranchTable: React.FC<BranchTableProps> = ({ data, onEdit }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      setLoading(true);
      const res = await deleteBranch(selectedId);
      if (res.success) {
        toast.success("Branch deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete branch.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  const handleMakePrimary = async (id: string) => {
    try {
      setLoading(true);
      const res = await setPrimaryBranch(id);
      if (res.success) {
        toast.success("Primary branch updated.");
      } else {
        toast.error(res.error || "Failed to update branch.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleDelete(); }} 
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phones</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No branches found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {branch.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {branch.phones && branch.phones.length > 0 ? branch.phones[0] : "N/A"}
                  </TableCell>
                  <TableCell>
                    {branch.isPrimary ? (
                      <Badge variant="default">Primary</Badge>
                    ) : (
                      <Badge variant="secondary">Secondary</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!branch.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Set as Primary"
                        onClick={() => handleMakePrimary(branch.id)}
                        disabled={loading}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(branch)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={loading}
                      onClick={() => {
                        setSelectedId(branch.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
