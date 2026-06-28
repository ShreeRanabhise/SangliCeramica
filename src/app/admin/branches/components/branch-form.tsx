"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createBranch, updateBranch } from "@/actions/branches";
import { Loader2, ArrowLeft, Plus, Trash } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface BranchFormProps {
  initialData?: any | null;
  onClose: () => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({ initialData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(initialData?.isPrimary || false);
  const [phones, setPhones] = useState<string[]>(initialData?.phones || [""]);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");

  const title = initialData ? "Edit Branch" : "Create Branch";
  const description = initialData ? "Edit an existing branch." : "Add a new physical branch.";
  const action = initialData ? "Save changes" : "Create";

  const addPhone = () => setPhones([...phones, ""]);
  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };
  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const filteredPhones = phones.filter(p => p.trim() !== "");

      const payload = {
        name: formData.get("name"),
        isPrimary,
        address: formData.get("address"),
        mapUrl: formData.get("mapUrl"),
        imageUrl,
        phones: filteredPhones,
        whatsapp: formData.get("whatsapp"),
        email: formData.get("email"),
        hours: formData.get("hours"),
        order: Number(formData.get("order") || 0)
      };

      let response;
      if (initialData) {
        response = await updateBranch(initialData.id, payload);
      } else {
        response = await createBranch(payload);
      }

      if (response.success) {
        toast.success(`Branch ${initialData ? "updated" : "created"} successfully.`);
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
      
      <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                disabled={loading} 
                defaultValue={initialData?.name || ""} 
                placeholder="e.g. Main Showroom" 
                required 
              />
            </div>

            <div className="flex items-center space-x-2 pt-2 pb-2">
              <Checkbox 
                id="isPrimary" 
                checked={isPrimary} 
                onCheckedChange={(c) => setIsPrimary(!!c)} 
                disabled={loading}
              />
              <label
                htmlFor="isPrimary"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as Primary Branch
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Working Hours <span className="text-destructive">*</span></Label>
              <Textarea 
                id="hours" 
                name="hours" 
                disabled={loading} 
                defaultValue={initialData?.hours || ""} 
                placeholder="Mon-Sat: 10AM - 8PM" 
                required 
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input 
                id="order" 
                name="order"
                type="number" 
                disabled={loading} 
                defaultValue={initialData?.order || "0"} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>

            <div className="space-y-3">
              <Label>Phone Numbers</Label>
              {phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input 
                    value={phone} 
                    onChange={(e) => updatePhone(i, e.target.value)} 
                    placeholder="+91 98765 43210"
                    disabled={loading} 
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(i)} disabled={loading}>
                    <Trash className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPhone} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Phone Number
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input 
                id="whatsapp" 
                name="whatsapp" 
                disabled={loading} 
                defaultValue={initialData?.whatsapp || ""} 
                placeholder="+91 98765 43210" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                disabled={loading} 
                defaultValue={initialData?.email || ""} 
                placeholder="branch@sangliceramica.com" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Location & Media</h3>
          <div className="space-y-4 mb-4">
            <Label>Showroom Image</Label>
            <ImageUpload 
              value={imageUrl ? [imageUrl] : []} 
              disabled={loading} 
              onChange={(url) => setImageUrl(url)} 
              onRemove={() => setImageUrl("")} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
            <Textarea 
              id="address" 
              name="address" 
              disabled={loading} 
              defaultValue={initialData?.address || ""} 
              required 
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
            <Input 
              id="mapUrl" 
              name="mapUrl" 
              disabled={loading} 
              defaultValue={initialData?.mapUrl || ""} 
              placeholder="https://www.google.com/maps/embed?..." 
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
