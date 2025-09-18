"use client";

import { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Upload, Plus, Minus, Eye } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { ProductInput } from "@/lib/validations";
import { toast } from "sonner";
import Image from "next/image";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

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

interface Product extends ProductInput {
  id?: string;
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

export default function ProductForm({
  product,
  isOpen,
  onClose,
  onSave,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    currency: "RWF",
    category: "",
    status: "Active",
    featured: false,
    stock: 0,
    sku: "",
    specifications: {},
    images: [],
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        currency: product.currency || "RWF",
        category: product.category || "",
        status: product.status || "Active",
        featured: product.featured || false,
        stock: product.stock || 0,
        sku: product.sku || "",
        specifications: product.specifications || {},
        images: product.images || [],
        slug: product.slug || "",
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
      });
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: 0,
        currency: "RWF",
        category: "",
        status: "Active",
        featured: false,
        stock: 0,
        sku: "",
        specifications: {},
        images: [],
        slug: "",
        metaTitle: "",
        metaDescription: "",
      });
    }
    // Clear errors when switching between add/edit modes
    setErrors({});
  }, [product]);
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesChange = (urls: string[]) => {
    handleInputChange("images", urls);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!formData.images || formData.images.length === 0)
      newErrors.images = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        console.log("saving.....");
        let result;
        if (product?.id) {
          result = await updateProduct(product.id, formData);
        } else {
          result = await createProduct(formData);
          console.log(result);
        }

        if (result.success) {
          console.log("Product saved successfully:");
          toast.success(
            product?.id
              ? "Product updated successfully!"
              : "Product created successfully!"
          );
          onSave({ ...formData, id: product?.id || result.data?.id });
          onClose();
        } else {
          toast.error(
            result.error || "Failed to save product. Please try again."
          );
          console.error(result.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Error saving product:", error);
      }
    });
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
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter product name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Enter product description"
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
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
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleInputChange("status", value)
                          }
                        >
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
                          onChange={(e) =>
                            handleInputChange("price", Number(e.target.value))
                          }
                          placeholder="0"
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) =>
                            handleInputChange("currency", value)
                          }
                        >
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
                        onChange={(e) =>
                          handleInputChange("stock", Number(e.target.value))
                        }
                        placeholder="0"
                        className={errors.stock ? "border-red-500" : ""}
                      />
                      {errors.stock && (
                        <p className="text-sm text-red-500">{errors.stock}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          handleInputChange("featured", checked)
                        }
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
                    <CardTitle>Product Images *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MultipleImageUpload
                      value={formData.images || []}
                      onChange={handleImagesChange}
                      folder="products"
                      placeholder="Upload product images"
                      aspectRatio="video"
                      maxImages={5}
                    />
                    {errors.images && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.images}
                      </p>
                    )}
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
                        value={
                          (formData.specifications as any)?.dimensions || ""
                        }
                        onChange={(e) =>
                          handleInputChange("specifications", {
                            ...formData.specifications,
                            dimensions: e.target.value,
                          })
                        }
                        placeholder="e.g., 9ft x 4.5ft x 32in"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={(formData.specifications as any)?.weight || ""}
                        onChange={(e) =>
                          handleInputChange("specifications", {
                            ...formData.specifications,
                            weight: e.target.value,
                          })
                        }
                        placeholder="e.g., 700 lbs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={(formData.specifications as any)?.material || ""}
                        onChange={(e) =>
                          handleInputChange("specifications", {
                            ...formData.specifications,
                            material: e.target.value,
                          })
                        }
                        placeholder="e.g., Slate bed, Hardwood frame"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={(formData.specifications as any)?.warranty || ""}
                        onChange={(e) =>
                          handleInputChange("specifications", {
                            ...formData.specifications,
                            warranty: e.target.value,
                          })
                        }
                        placeholder="e.g., 1 year"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku || ""}
                        onChange={(e) =>
                          handleInputChange("sku", e.target.value)
                        }
                        placeholder="Product SKU"
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
                <Badge
                  variant={
                    formData.status === "Active" ? "default" : "secondary"
                  }
                >
                  {formData.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isPending}>
                  <Save className="h-4 w-4" />
                  {isPending
                    ? "Saving..."
                    : product
                    ? "Update Product"
                    : "Save Product"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
