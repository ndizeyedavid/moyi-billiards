"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: "square" | "video" | "auto";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "moyi-billiards",
  placeholder = "Upload an image",
  className = "",
  width = 300,
  height = 200,
  aspectRatio = "auto"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      default:
        return "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
          hover:border-gray-400 transition-colors cursor-pointer
          ${getAspectRatioClass()}
          ${value ? 'border-solid border-gray-200' : ''}
        `}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {value ? (
          <div className="relative group">
            <Image
              src={value}
              alt="Uploaded image"
              width={width}
              height={height}
              className="mx-auto rounded-lg object-cover"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-600 mb-2">Uploading...</p>
                <p className="text-sm text-gray-400">Please wait while we upload your image</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">{placeholder}</p>
                <p className="text-sm text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full gap-2"
        >
          <Upload className="h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  );
}
