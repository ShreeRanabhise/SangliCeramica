"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string, publicId: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  bucket?: string;
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  bucket = "sangli-ceramica"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setIsUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl, filePath);
      toast.success("Image uploaded successfully");

    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be uploaded again if removed
      e.target.value = '';
    }
  };

  const handleRemove = async (url: string) => {
    // Note: The publicId (filePath) should ideally be passed back for deletion, 
    // but in this UI component we just pass the URL back to the parent 
    // to handle the actual database and storage deletion if needed.
    onRemove(url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-muted">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => handleRemove(url)} variant="destructive" size="sm" disabled={disabled || isUploading}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>
      <div>
        <input 
          type="file" 
          id="image-upload" 
          className="hidden" 
          accept="image/*"
          onChange={onUpload}
          disabled={disabled || isUploading}
        />
        <Button 
          type="button" 
          disabled={disabled || isUploading} 
          variant="secondary" 
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4 mr-2" />
          )}
          Upload an Image
        </Button>
      </div>
    </div>
  );
}
