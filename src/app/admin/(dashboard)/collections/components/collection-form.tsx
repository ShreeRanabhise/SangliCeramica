"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateCollection } from "@/actions/collections";
import { Loader2, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload"; // Works for videos too if Supabase accepts it, or we may need a VideoUpload. Assuming ImageUpload returns a URL.
import { useRouter } from "next/navigation";

interface CollectionFormProps {
  initialData: any;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.set("imageUrl", imageUrl);

      const response = await updateCollection(initialData.id, formData);

      if (response.success) {
        toast.success("Collection updated successfully.");
        router.push("/admin/collections");
      } else {
        toast.error(response.error || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/collections")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight capitalize">Edit {initialData.collection.toLowerCase()}</h2>
            <p className="text-sm text-muted-foreground">Update the title, tagline, and background image.</p>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      
      <form onSubmit={onSubmit} className="space-y-8 w-full max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Background Image URL</Label>
            <p className="text-xs text-muted-foreground mb-2">Upload a background image for the collection card.</p>
            <ImageUpload
              value={imageUrl ? [imageUrl] : []}
              disabled={loading}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
              folder="collections"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Display Title <span className="text-destructive">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              disabled={loading} 
              defaultValue={initialData.title} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea 
              id="tagline" 
              name="tagline" 
              disabled={loading} 
              defaultValue={initialData.tagline || ""} 
              rows={2}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button disabled={loading} type="submit" className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button disabled={loading} type="button" variant="outline" onClick={() => router.push("/admin/collections")} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};
