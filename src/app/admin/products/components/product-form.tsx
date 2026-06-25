"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/actions/products";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
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
  
  // States for complex fields
  const [images, setImages] = useState<any[]>(initialData?.images || []);
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);
  
  // Hierarchical selection
  const initCollection = initialData?.category?.collection || defaultCollection || "TILES";
  const [selectedCollection, setSelectedCollection] = useState<string>(initCollection);
  
  const filteredCategories = categories.filter(c => c.collection === selectedCollection);
  
  // Parse specifications if they exist
  const initSpecs = initialData?.specifications ? Object.entries(initialData.specifications).map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }];
  const [specifications, setSpecifications] = useState<any[]>(initSpecs);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit an existing product's details and gallery." : "Add a new product to your inventory.";
  const action = initialData ? "Save changes" : "Create";

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));
  const handleFeatureChange = (idx: number, val: string) => {
    const newF = [...features];
    newF[idx] = val;
    setFeatures(newF);
  };

  const handleAddSpec = () => setSpecifications([...specifications, { key: "", value: "" }]);
  const handleRemoveSpec = (idx: number) => setSpecifications(specifications.filter((_, i) => i !== idx));
  const handleSpecChange = (idx: number, field: "key" | "value", val: string) => {
    const newS = [...specifications];
    newS[idx][field] = val;
    setSpecifications(newS);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const name = formData.get("name") as string;
      const sku = formData.get("sku") as string;
      const desc = formData.get("description") as string;
      const categoryId = formData.get("categoryId") as string;
      const isFeatured = formData.get("isFeatured") === "on";

      const cleanedFeatures = features.filter(f => f.trim() !== "");
      
      const cleanedSpecs: Record<string, string> = {};
      specifications.forEach(s => {
        if (s.key.trim() !== "" && s.value.trim() !== "") {
          cleanedSpecs[s.key] = s.value;
        }
      });

      const payload = {
        name,
        sku,
        description: desc,
        categoryId,
        isFeatured,
        features: cleanedFeatures,
        specifications: cleanedSpecs,
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
            bucket="products"
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
            <Label htmlFor="sku">SKU Code <span className="text-destructive">*</span></Label>
            <Input id="sku" name="sku" disabled={loading} defaultValue={initialData?.sku || ""} placeholder="e.g. TILE-STAT-01" required />
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

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" disabled={loading} defaultValue={initialData?.description || ""} placeholder="Detailed product description..." rows={5} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={initialData?.isFeatured} className="w-4 h-4 rounded border-gray-300" />
          <Label htmlFor="isFeatured" className="font-normal cursor-pointer">Feature this product on the homepage</Label>
        </div>

        {/* Features Array */}
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
          </div>
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={f} onChange={(e) => handleFeatureChange(i, e.target.value)} placeholder="e.g. Scratch resistant" />
              <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveFeature(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Specifications JSON */}
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSpec}>
              <Plus className="h-4 w-4 mr-2" /> Add Spec
            </Button>
          </div>
          {specifications.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input className="w-1/3" value={s.key} onChange={(e) => handleSpecChange(i, "key", e.target.value)} placeholder="e.g. Dimensions" />
              <Input className="w-full" value={s.value} onChange={(e) => handleSpecChange(i, "value", e.target.value)} placeholder="e.g. 600x1200 mm" />
              <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveSpec(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
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
