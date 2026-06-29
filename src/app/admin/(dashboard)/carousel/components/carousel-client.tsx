"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCarouselImage, deleteCarouselImage } from "@/actions/carousel";
import { toast } from "sonner";
import { Loader2, Plus, Trash, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

export const CarouselClient = ({ data }: { data: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload an image.");
      return;
    }
    
    try {
      setLoading(true);
      const res = await createCarouselImage({ 
        imageUrl, 
        title, 
        subtitle, 
        order: data.length 
      });
      if (res.success) {
        toast.success("Image added to carousel");
        setTitle("");
        setSubtitle("");
        setImageUrl("");
      } else {
        toast.error(res.error || "Failed to add image");
      }
    } catch (error: any) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      setLoading(true);
      const res = await deleteCarouselImage(id);
      if (res.success) toast.success("Image deleted");
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
          <h2 className="text-3xl font-bold tracking-tight">Homepage Carousel</h2>
          <p className="text-sm text-muted-foreground">Manage the sliding background images in the Hero section.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border rounded-lg p-6 bg-card h-fit">
          <h3 className="text-lg font-semibold mb-4">Add New Image</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Image (Required)</Label>
              <ImageUpload 
                folder="carousel" 
                value={imageUrl ? [imageUrl] : []} 
                onChange={(url) => setImageUrl(url)} 
                onRemove={() => setImageUrl("")} 
                disabled={loading} 
              />
            </div>
            <div className="space-y-2">
              <Label>Title (Optional)</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} disabled={loading} placeholder="E.g. Premium Tiles" />
            </div>
            <div className="space-y-2">
              <Label>Subtitle (Optional)</Label>
              <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} disabled={loading} placeholder="Discover our new collection..." />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !imageUrl}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" /> Add to Carousel
            </Button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 flex flex-col justify-between bg-card">
                <div>
                  <img src={item.imageUrl} alt={item.title || "Carousel"} className="w-full h-40 object-cover rounded-md mb-4" />
                  <h4 className="font-semibold">{item.title || "No Title"}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.subtitle}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-mono text-muted-foreground">Order: {item.order}</span>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)} disabled={loading}>
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                No images found in carousel. Add one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
