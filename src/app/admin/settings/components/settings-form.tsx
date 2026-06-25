"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/actions/settings";
import { toast } from "sonner";
import { Loader2, Plus, Trash } from "lucide-react";
import FileUpload from "@/components/admin/file-upload";

interface SettingsFormProps {
  initialData: any;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState<string[]>(initialData?.phones || [""]);
  const [catalogueUrl, setCatalogueUrl] = useState<string>(initialData?.catalogueUrl || "");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const filteredPhones = phones.filter(p => p.trim() !== "");

      const res = await updateSettings({
        address: formData.get("address") as string,
        mapUrl: formData.get("mapUrl") as string,
        phones: filteredPhones,
        whatsapp: formData.get("whatsapp") as string,
        email: formData.get("email") as string,
        hours: formData.get("hours") as string,
        catalogueUrl: catalogueUrl,
        socialLinks: {
          facebook: formData.get("facebook"),
          instagram: formData.get("instagram"),
        }
      });

      if (res.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(res.error || "Failed to update settings.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const addPhone = () => setPhones([...phones, ""]);
  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };
  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="email">Public Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              defaultValue={initialData?.email} 
              required 
              disabled={loading} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input 
              id="whatsapp" 
              name="whatsapp" 
              defaultValue={initialData?.whatsapp} 
              placeholder="+91 98765 43210"
              required 
              disabled={loading} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Working Hours</Label>
            <Textarea 
              id="hours" 
              name="hours" 
              defaultValue={initialData?.hours} 
              placeholder="Mon-Sat: 10AM - 8PM"
              required 
              disabled={loading}
              rows={3}
            />
          </div>
        </div>

        {/* Phones */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Phone Numbers</h3>
          
          <div className="space-y-3">
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
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Catalogue</h3>
        <div className="space-y-2">
          <Label>Product Catalogue (PDF)</Label>
          <FileUpload
            value={catalogueUrl ? [catalogueUrl] : []}
            onChange={(url) => setCatalogueUrl(url)}
            onRemove={() => setCatalogueUrl("")}
            bucket="catalogue"
            accept="application/pdf"
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground">Upload your product catalogue here. It will be available for download by visitors.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Full Address</Label>
          <Textarea 
            id="address" 
            name="address" 
            defaultValue={initialData?.address} 
            required 
            disabled={loading} 
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mapUrl">Google Maps Embed URL (Optional)</Label>
          <Input 
            id="mapUrl" 
            name="mapUrl" 
            defaultValue={initialData?.mapUrl} 
            placeholder="https://www.google.com/maps/embed?..."
            disabled={loading} 
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Social Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input 
              id="facebook" 
              name="facebook" 
              defaultValue={initialData?.socialLinks?.facebook} 
              disabled={loading} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input 
              id="instagram" 
              name="instagram" 
              defaultValue={initialData?.socialLinks?.instagram} 
              disabled={loading} 
            />
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
};
