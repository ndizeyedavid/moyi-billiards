"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MultipleImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  placeholder?: string;
  className?: string;
  maxImages?: number;
  aspectRatio?: "square" | "video" | "auto";
}

export function MultipleImageUpload({
  value = [],
  onChange,
  folder = "moyi-billiards",
  placeholder = "Upload images",
  className = "",
  maxImages = 5,
  aspectRatio = "auto"
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Only JPEG, PNG, and WebP are allowed.`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed for ${file.name}`);
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...value, ...uploadedUrls];
      onChange(newImages);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "aspect-[4/3]";
    }
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Display uploaded images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className={`relative overflow-hidden rounded-lg border ${getAspectRatioClass()}`}>
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div 
          className={`
            border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
            hover:border-gray-400 transition-colors cursor-pointer
            ${getAspectRatioClass()}
          `}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center py-8">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-600 mb-2">Uploading...</p>
                <p className="text-sm text-gray-400">Please wait while we upload your images</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">{placeholder}</p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, WebP up to 5MB each • {value.length}/{maxImages} images
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || !canAddMore}
      />

      {canAddMore && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add More Images ({value.length}/{maxImages})
        </Button>
      )}

      {!canAddMore && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum number of images reached ({maxImages}/{maxImages})
        </p>
      )}
    </div>
  );
}
