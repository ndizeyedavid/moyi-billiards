'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { productSchema, type ProductInput } from '@/lib/validations'

export async function createProduct(data: ProductInput) {
  try {
    // Validate input
    const validatedData = productSchema.parse(data)
    
    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const product = await prisma.product.create({
      data: validatedData,
    })

    revalidatePath('/admin/dashboard/products')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    }
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  try {
    // Validate input
    const validatedData = productSchema.parse(data)

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/admin/dashboard/products')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update product' 
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/admin/dashboard/products')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete product' 
    }
  }
}

export async function getProducts(params?: {
  search?: string
  category?: string
  status?: string
  page?: number
  limit?: number
}) {
  try {
    const {
      search = '',
      category,
      status,
      page = 1,
      limit = 10,
    } = params || {}

    const skip = (page - 1) * limit
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (status && status !== 'All') {
      where.status = status
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

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
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { 
      success: false, 
      error: 'Failed to fetch products' 
    }
  }
}
