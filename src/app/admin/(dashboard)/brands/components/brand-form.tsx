"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBrand, updateBrand } from "@/actions/brands";
import { Loader2, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface BrandFormProps {
  initialData?: any | null;
  onClose: () => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(initialData?.logo || "");

  const title = initialData ? "Edit Brand" : "Create Brand";
  const description = initialData ? "Edit an existing product brand." : "Add a new brand to your store.";
  const action = initialData ? "Save changes" : "Create";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.set("logo", logoUrl);

      let response;
      if (initialData) {
        response = await updateBrand(initialData.id, formData);
      } else {
        response = await createBrand(formData);
      }

      if (response.success) {
        toast.success(`Brand ${initialData ? "updated" : "created"} successfully.`);
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
            <Label>Brand Logo</Label>
            <ImageUpload
              value={logoUrl ? [logoUrl] : []}
              disabled={loading}
              onChange={(url) => setLogoUrl(url)}
              onRemove={() => setLogoUrl("")}
              folder="brands"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              disabled={loading} 
              defaultValue={initialData?.name || ""} 
              placeholder="e.g. Kohler" 
              required 
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
