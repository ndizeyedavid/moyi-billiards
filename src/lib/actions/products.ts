"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductInput } from "@/lib/validations";

export async function createProduct(data: ProductInput) {
  try {
    console.log("Creating product with data:", data);

    // Skip Zod validation temporarily and manually validate/transform data
    const validatedData = {
      name: data.name || "",
      description: data.description || null,
      price: Number(data.price) || 0,
      currency: data.currency || "RWF",
      category: data.category || "",
      status: (data.status as "Active" | "Draft" | "Out of Stock") || "Active",
      featured: Boolean(data.featured),
      stock: Number(data.stock) || 0,
      sku: data.sku || null,
      specifications: data.specifications
        ? JSON.parse(JSON.stringify(data.specifications))
        : null,
      images: Array.isArray(data.images) ? data.images : [],
      slug:
        data.slug ||
        data.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        "",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    };

    // Basic validation
    if (!validatedData.name.trim()) {
      return {
        success: false,
        error: "Product name is required",
      };
    }

    if (validatedData.price <= 0) {
      return {
        success: false,
        error: "Price must be greater than 0",
      };
    }

    console.log("Validated data:", validatedData);

    const product = await prisma.product.create({
      data: validatedData,
    });

    console.log("Product created successfully:", product.id);
    revalidatePath("/admin/dashboard/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  try {
    console.log("Updating product with data:", data);

    // Skip Zod validation temporarily and manually validate/transform data
    const validatedData = {
      name: data.name || "",
      description: data.description || null,
      price: Number(data.price) || 0,
      currency: data.currency || "RWF",
      category: data.category || "",
      status: data.status as "Active" | "Draft" | "Out of Stock" || "Active",
      featured: Boolean(data.featured),
      stock: Number(data.stock) || 0,
      sku: data.sku || null,
      specifications: data.specifications
        ? JSON.parse(JSON.stringify(data.specifications))
        : null,
      images: Array.isArray(data.images) ? data.images : [],
      slug:
        data.slug ||
        data.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        "",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    };

    // Basic validation
    if (!validatedData.name.trim()) {
      return {
        success: false,
        error: "Product name is required",
      };
    }

    if (validatedData.price <= 0) {
      return {
        success: false,
        error: "Price must be greater than 0",
      };
    }

    console.log("Validated data for update:", validatedData);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    console.log("Product updated successfully:", product.id);
    revalidatePath("/admin/dashboard/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

export async function getProducts(params?: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      search = "",
      category,
      status,
      page = 1,
      limit = 10,
    } = params || {};

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}
