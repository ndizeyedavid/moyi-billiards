"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Save, Eye } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: string;
  stock: number;
  image: string;
  featured: boolean;
  specifications?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  warranty?: string;
}

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const categories = ["Professional", "Standard", "Premium", "Compact"];
const statuses = ["Active", "Draft", "Out of Stock"];
const currencies = ["RWF", "USD", "EUR"];

export default function ProductForm({ product, isOpen, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    currency: product?.currency || "RWF",
    category: product?.category || "Standard",
    status: product?.status || "Draft",
    stock: product?.stock || 0,
    image: product?.image || "",
    featured: product?.featured || false,
    specifications: product?.specifications || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || "",
    material: product?.material || "",
    warranty: product?.warranty || "1 year",
  });

  const [imagePreview, setImagePreview] = useState(product?.image || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!formData.image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...formData, id: product?.id });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter product name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter product description"
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", Number(e.target.value))}
                          placeholder="0"
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", Number(e.target.value))}
                        placeholder="0"
                        className={errors.stock ? "border-red-500" : ""}
                      />
                      {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange("featured", checked)}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Image and Specifications */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Image *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <Image
                              src={imagePreview}
                              alt="Product preview"
                              width={300}
                              height={200}
                              className="mx-auto rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setImagePreview("");
                                handleInputChange("image", "");
                              }}
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Upload product image</p>
                            <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full"
                      />
                      {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        placeholder="e.g., 9ft x 4.5ft x 32in"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="e.g., 700 lbs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                        placeholder="e.g., Slate bed, Hardwood frame"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={formData.warranty}
                        onChange={(e) => handleInputChange("warranty", e.target.value)}
                        placeholder="e.g., 1 year"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specifications">Additional Specifications</Label>
                      <Textarea
                        id="specifications"
                        value={formData.specifications}
                        onChange={(e) => handleInputChange("specifications", e.target.value)}
                        placeholder="Enter additional specifications..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                {formData.featured && (
                  <Badge variant="outline">Featured Product</Badge>
                )}
                <Badge variant={formData.status === "Active" ? "default" : "secondary"}>
                  {formData.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {product ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
