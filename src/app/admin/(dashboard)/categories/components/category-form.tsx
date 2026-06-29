"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/actions/categories";
import { Loader2, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface CategoryFormProps {
  initialData?: any | null;
  onClose: () => void;
  defaultCollection?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onClose, defaultCollection }) => {
  const [loading, setLoading] = useState(false);
  const [iconUrl, setIconUrl] = useState<string>(initialData?.icon || "");

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit an existing product category." : "Add a new category to your store.";
  const action = initialData ? "Save changes" : "Create";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.set("icon", iconUrl);

      let response;
      if (initialData) {
        response = await updateCategory(initialData.id, formData);
      } else {
        response = await createCategory(formData);
      }

      if (response.success) {
        toast.success(`Category ${initialData ? "updated" : "created"} successfully.`);
        onClose();
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
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      
      <form onSubmit={onSubmit} className="space-y-8 w-full max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category Icon/Image</Label>
            <ImageUpload
              value={iconUrl ? [iconUrl] : []}
              disabled={loading}
              onChange={(url) => setIconUrl(url)}
              onRemove={() => setIconUrl("")}
              folder="categories"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection">Collection <span className="text-destructive">*</span></Label>
            <select 
              id="collection" 
              name="collection" 
              disabled={loading} 
              defaultValue={initialData?.collection || defaultCollection || "TILES"} 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="TILES">Tiles</option>
              <option value="SANITARYWARE">Sanitaryware</option>
              <option value="DOORS">Doors</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              disabled={loading} 
              defaultValue={initialData?.name || ""} 
              placeholder="e.g. Luxury Tiles" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              disabled={loading} 
              defaultValue={initialData?.description || ""} 
              placeholder="Describe the category..." 
              rows={4}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Button disabled={loading} type="submit" className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action}
          </Button>
          <Button disabled={loading} type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};
