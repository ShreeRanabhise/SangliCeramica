"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAlbum } from "@/actions/gallery";
import { toast } from "sonner";
import { AlbumForm } from "./album-form";

interface AlbumClientProps {
  data: any[];
}

export const AlbumClient: React.FC<AlbumClientProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      const res = await deleteAlbum(id);
      if (res.success) {
        toast.success("Album deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete album.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    }
  };

  const openEdit = (album: any) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setSelectedAlbum(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAlbum ? "Edit Album" : "Create New Album"}</DialogTitle>
          </DialogHeader>
          <AlbumForm 
            initialData={selectedAlbum} 
            onSuccess={() => setIsModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Showroom Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Manage your showroom albums and photos.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Album
        </Button>
      </div>
      <hr className="my-4" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Album Name</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No albums found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((album) => (
                <TableRow key={album.id}>
                  <TableCell className="font-medium">{album.name}</TableCell>
                  <TableCell>{album.media.length} photos</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(album)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(album.id)}
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
