"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAlbum, updateAlbum, addMediaToAlbum } from "@/actions/gallery";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface AlbumFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const AlbumForm: React.FC<AlbumFormProps> = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{url: string, publicId: string, type: string}[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.media ? initialData.media.map((m: any) => m.url) : []
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const description = formData.get("description") as string;

      let albumId = initialData?.id;

      if (initialData) {
        const res = await updateAlbum(albumId, { name, slug, description });
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createAlbum({ name, slug, description });
        if (!res.success) throw new Error(res.error);
        albumId = res.data?.id;
      }

      // Add new media
      if (mediaFiles.length > 0 && albumId) {
        const mediaRes = await addMediaToAlbum(albumId, mediaFiles);
        if (!mediaRes.success) throw new Error(mediaRes.error);
      }

      toast.success(initialData ? "Album updated!" : "Album created!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setMediaFiles(prev => [...prev, { url, publicId, type: "IMAGE" }]);
    setExistingImages(prev => [...prev, url]);
  };

  const handleImageRemove = (url: string) => {
    setMediaFiles(prev => prev.filter(m => m.url !== url));
    setExistingImages(prev => prev.filter(imgUrl => imgUrl !== url));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Album Name</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={initialData?.name} 
          required 
          disabled={loading} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input 
          id="slug" 
          name="slug" 
          defaultValue={initialData?.slug} 
          required 
          disabled={loading} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          defaultValue={initialData?.description || ""} 
          disabled={loading} 
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Photos</Label>
        <ImageUpload
          value={existingImages}
          onChange={handleImageUpload}
          onRemove={handleImageRemove}
          disabled={loading}
          folder="gallery"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Note: Images cannot be deleted from this view once saved. You can upload new ones.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Save Changes" : "Create Album"}
      </Button>
    </form>
  );
};
