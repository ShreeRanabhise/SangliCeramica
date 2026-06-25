"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePlus, Trash, Loader2, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface FileUploadProps {
  disabled?: boolean;
  onChange: (value: string, publicId: string) => void;
  onRemove: (value: string) => void;
  value: string[]; // URLs of the files
  bucket?: string;
  accept?: string;
}

export default function FileUpload({
  disabled,
  onChange,
  onRemove,
  value,
  bucket = "sangli-ceramica",
  accept = "application/pdf"
}: FileUploadProps) {
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
      toast.success("File uploaded successfully");

    } catch (error: any) {
      toast.error(error.message || "Error uploading file");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (url: string) => {
    onRemove(url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        {value.map((url) => (
          <div key={url} className="flex items-center justify-between p-3 border rounded-md bg-muted/50 max-w-md">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline truncate">
                {url.split('/').pop()}
              </a>
            </div>
            <Button type="button" onClick={() => handleRemove(url)} variant="ghost" size="icon" className="text-destructive shrink-0" disabled={disabled || isUploading}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div>
        <input 
          type="file" 
          id={`file-upload-${bucket}`}
          className="hidden" 
          accept={accept}
          onChange={onUpload}
          disabled={disabled || isUploading}
        />
        <Button 
          type="button" 
          disabled={disabled || isUploading} 
          variant="secondary" 
          onClick={() => document.getElementById(`file-upload-${bucket}`)?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FilePlus className="h-4 w-4 mr-2" />
          )}
          Upload File
        </Button>
      </div>
    </div>
  );
}
