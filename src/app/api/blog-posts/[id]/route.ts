import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { blogPostSchema } from '@/lib/validations'

// GET /api/blog-posts/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    })

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog-posts/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = blogPostSchema.parse(body)

    // Recalculate word count and read time if content changed
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length
      validatedData.wordCount = wordCount
      validatedData.readTime = Math.ceil(wordCount / 200)
    }

    const blogPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(blogPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog-posts/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
