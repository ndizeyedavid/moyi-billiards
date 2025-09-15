import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/blog/[id] - Get single blog post details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: postId,
        status: "Published", // Only show published posts to public
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        author: true,
        status: true,
        publishedAt: true,
        category: true,
        tags: true,
        featured: true,
        featuredImage: true,
        metaTitle: true,
        metaDescription: true,
        readTime: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blogPost,
    });
  } catch (error) {
    console.error("Error fetching blog post details:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post details" },
      { status: 500 }
    );
  }
}
