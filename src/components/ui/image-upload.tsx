"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string; // e.g., 'blogs', 'projects', 'testimonials'
  className?: string;
}

export function ImageUpload({ value, onChange, folder, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
      onChange(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border neo-shadow">
          <img
            src={value}
            alt="Upload"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {isUploading ? "Uploading..." : "Click to upload image"}
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
