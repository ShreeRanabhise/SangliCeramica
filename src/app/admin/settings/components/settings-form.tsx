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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      const res = await updateSettings({
        whatsapp: formData.get("whatsapp") as string,
        email: formData.get("email") as string,
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

        </div>

        {/* Global Social Media */}
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
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
};
