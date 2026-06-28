"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import { Loader2, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface ProductFormProps {
  initialData?: any | null;
  categories: any[];
  onClose: () => void;
  defaultCategory?: string;
  defaultCollection?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, onClose, defaultCategory, defaultCollection }) => {
  const [loading, setLoading] = useState(false);
  
  const [images, setImages] = useState<any[]>(initialData?.images || []);
  
  const initCollection = initialData?.category?.collection || defaultCollection || "TILES";
  const [selectedCollection, setSelectedCollection] = useState<string>(initCollection);
  
  const filteredCategories = categories.filter(c => c.collection === selectedCollection);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit an existing product's details and images." : "Add a new product to your inventory.";
  const action = initialData ? "Save changes" : "Create";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const name = formData.get("name") as string;
      const size = formData.get("size") as string;
      const categoryId = formData.get("categoryId") as string;

      const payload = {
        name,
        size,
        categoryId,
        images,
      };

      let response;
      if (initialData) {
        response = await updateProduct(initialData.id, payload);
      } else {
        response = await createProduct(payload);
      }

      if (response.success) {
        toast.success(`Product ${initialData ? "updated" : "created"} successfully.`);
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
      
      <form onSubmit={onSubmit} className="space-y-8 w-full max-w-4xl pb-10">
        
        {/* Images Section */}
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-4">Product Images</h3>
          <ImageUpload
            value={images.map(img => img.url)}
            disabled={loading}
            onChange={(url, publicId) => setImages([...images, { url, publicId }])}
            onRemove={(url) => setImages(images.filter(img => img.url !== url))}
            folder="products"
          />
          <p className="text-sm text-muted-foreground mt-2">The first image will be used as the primary thumbnail.</p>
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" disabled={loading} defaultValue={initialData?.name || ""} placeholder="e.g. Statuario White Tile" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input id="size" name="size" disabled={loading} defaultValue={initialData?.size || ""} placeholder="e.g. 600x1200 mm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionSelect">Collection <span className="text-destructive">*</span></Label>
            <select 
              id="collectionSelect" 
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              disabled={loading} 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="TILES">Tiles</option>
              <option value="SANITARYWARE">Sanitaryware</option>
              <option value="DOORS">Doors</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category <span className="text-destructive">*</span></Label>
            <select 
              id="categoryId" 
              name="categoryId" 
              disabled={loading} 
              defaultValue={initialData?.categoryId || defaultCategory || ""} 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>Select a category</option>
              {filteredCategories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
