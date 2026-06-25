"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCatalogue, deleteCatalogue } from "@/actions/catalogues";
import { toast } from "sonner";
import { Loader2, Plus, Trash, FileText } from "lucide-react";
import FileUpload from "@/components/admin/file-upload";
import ImageUpload from "@/components/admin/image-upload";

export const CatalogueClient = ({ data }: { data: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [title, setTitle] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      toast.error("Please upload a PDF file.");
      return;
    }
    
    try {
      setLoading(true);
      const res = await createCatalogue({ title, fileUrl, coverImage });
      if (res.success) {
        toast.success("Catalogue added successfully");
        setTitle("");
        setFileUrl("");
        setCoverImage("");
      } else {
        toast.error(res.error || "Failed to add catalogue");
      }
    } catch (error: any) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this catalogue?")) return;
    try {
      setLoading(true);
      const res = await deleteCatalogue(id);
      if (res.success) toast.success("Catalogue deleted");
      else toast.error(res.error || "Failed to delete");
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Catalogues</h2>
          <p className="text-sm text-muted-foreground">Manage PDF product catalogues.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border rounded-lg p-6 bg-card h-fit">
          <h3 className="text-lg font-semibold mb-4">Add New Catalogue</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} disabled={loading} placeholder="e.g. 2026 Tile Collection" />
            </div>
            <div className="space-y-2">
              <Label>Cover Image (Optional)</Label>
              <ImageUpload 
                folder="catalogue" 
                value={coverImage ? [coverImage] : []} 
                onChange={(url) => setCoverImage(url)} 
                onRemove={() => setCoverImage("")} 
                disabled={loading} 
              />
            </div>
            <div className="space-y-2">
              <Label>PDF File</Label>
              <FileUpload 
                folder="catalogue" 
                value={fileUrl ? [fileUrl] : []} 
                onChange={(url) => setFileUrl(url)} 
                onRemove={() => setFileUrl("")} 
                disabled={loading} 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !fileUrl || !title}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" /> Add Catalogue
            </Button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between bg-card">
                <div>
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-32 object-cover rounded-md mb-4" />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <h4 className="font-semibold">{item.title}</h4>
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block mt-1">
                    View PDF
                  </a>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)} disabled={loading}>
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                No catalogues found. Add one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
