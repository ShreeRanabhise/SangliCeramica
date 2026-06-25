"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateContent } from "@/actions/content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContentFormProps {
  section: string;
  initialData: any;
}

export const ContentForm: React.FC<ContentFormProps> = ({ section, initialData }) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      let contentJson = {};

      if (section === "HERO") {
        contentJson = {
          title: formData.get("title"),
          subtitle: formData.get("subtitle"),
        };
      } else if (section === "ABOUT") {
        contentJson = {
          heading: formData.get("heading"),
          text: formData.get("text"),
        };
      } else {
        // Fallback for raw JSON
        const raw = formData.get("rawJson") as string;
        contentJson = JSON.parse(raw);
      }

      const res = await updateContent(section, contentJson);
      if (res.success) {
        toast.success(`${section} content updated successfully!`);
      } else {
        toast.error(res.error || "Failed to update content.");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid JSON or network error.");
    } finally {
      setLoading(false);
    }
  };

  const data = initialData?.content || {};

  if (section === "HERO") {
    return (
      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Hero Title</Label>
          <Input 
            id="title" 
            name="title" 
            defaultValue={data.title || "The Pinnacle of Elegance"} 
            required 
            disabled={loading} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Hero Subtitle</Label>
          <Textarea 
            id="subtitle" 
            name="subtitle" 
            defaultValue={data.subtitle || "Discover Sangli's most exclusive collection..."} 
            required 
            disabled={loading} 
            rows={3}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Hero Content
        </Button>
      </form>
    );
  }

  if (section === "ABOUT") {
    return (
      <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="heading">About Section Heading</Label>
          <Input 
            id="heading" 
            name="heading" 
            defaultValue={data.heading || "Experience True Luxury"} 
            required 
            disabled={loading} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="text">About Text</Label>
          <Textarea 
            id="text" 
            name="text" 
            defaultValue={data.text || ""} 
            required 
            disabled={loading} 
            rows={6}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save About Content
        </Button>
      </form>
    );
  }

  // Fallback for other sections
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="rawJson">Raw JSON Content</Label>
        <Textarea 
          id="rawJson" 
          name="rawJson" 
          defaultValue={JSON.stringify(data, null, 2)} 
          required 
          disabled={loading} 
          rows={10}
          className="font-mono text-sm"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save JSON Content
      </Button>
    </form>
  );
};
