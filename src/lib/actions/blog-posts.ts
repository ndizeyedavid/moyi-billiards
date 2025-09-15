'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { blogPostSchema, type BlogPostInput } from '@/lib/validations'

export async function createBlogPost(data: BlogPostInput) {
  try {
    console.log('Creating blog post with data:', data)
    
    // Manual validation and transformation
    const validatedData = {
      title: data.title || '',
      slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
      content: data.content || '',
      excerpt: data.excerpt || null,
      author: data.author || 'Wilson Moyi',
      status: data.status as 'Draft' | 'Published' | 'Scheduled' || 'Draft',
      publishedAt: data.publishedAt || null,
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      featured: Boolean(data.featured),
      featuredImage: data.featuredImage || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readTime: null as number | null,
      wordCount: null as number | null,
    }
    
    // Basic validation
    if (!validatedData.title.trim()) {
      return {
        success: false,
        error: 'Blog post title is required'
      }
    }
    
    if (!validatedData.content.trim()) {
      return {
        success: false,
        error: 'Blog post content is required'
      }
    }

    // Calculate word count and read time
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length
      validatedData.wordCount = wordCount
      validatedData.readTime = Math.ceil(wordCount / 200)
    }

    console.log('Validated blog post data:', validatedData)

    const blogPost = await prisma.blogPost.create({
      data: validatedData,
    })

    console.log('Blog post created successfully:', blogPost.id)
    revalidatePath('/admin/dashboard/posts')
    return { success: true, data: blogPost }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create blog post' 
    }
  }
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  try {
    console.log('Updating blog post with data:', data)
    
    // Manual validation and transformation
    const validatedData = {
      title: data.title || '',
      slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
      content: data.content || '',
      excerpt: data.excerpt || null,
      author: data.author || 'Wilson Moyi',
      status: data.status as 'Draft' | 'Published' | 'Scheduled' || 'Draft',
      publishedAt: data.publishedAt || null,
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      featured: Boolean(data.featured),
      featuredImage: data.featuredImage || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readTime: null as number | null,
      wordCount: null as number | null,
    }
    
    // Basic validation
    if (!validatedData.title.trim()) {
      return {
        success: false,
        error: 'Blog post title is required'
      }
    }
    
    if (!validatedData.content.trim()) {
      return {
        success: false,
        error: 'Blog post content is required'
      }
    }

    // Recalculate word count and read time if content changed
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length
      validatedData.wordCount = wordCount
      validatedData.readTime = Math.ceil(wordCount / 200)
    }

    console.log('Validated blog post data for update:', validatedData)

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: validatedData,
    })

    console.log('Blog post updated successfully:', blogPost.id)
    revalidatePath('/admin/dashboard/posts')
    return { success: true, data: blogPost }
  } catch (error) {
    console.error('Error updating blog post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update blog post' 
    }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    })

    revalidatePath('/admin/dashboard/posts')
    return { success: true }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete blog post' 
    }
  }
}

export async function getBlogPosts(params?: {
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
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (status && status !== 'All') {
      where.status = status
    }

    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ])

    return {
      success: true,
      data: {
        blogPosts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { 
      success: false, 
      error: 'Failed to fetch blog posts' 
    }
  }
}
