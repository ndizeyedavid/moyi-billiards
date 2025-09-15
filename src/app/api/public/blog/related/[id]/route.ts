import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/blog/related/[id] - Get related blog posts
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

    // First get the current post to find related posts by category/tags
    const currentPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { category: true, tags: true },
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Find related posts by same category or similar tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { status: "Published" },
          { id: { not: postId } }, // Exclude current post
          {
            OR: [
              { category: currentPost.category },
              { tags: { hasSome: currentPost.tags } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        readTime: true,
        publishedAt: true,
        category: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3, // Limit to 3 related posts
    });

    return NextResponse.json({
      success: true,
      relatedPosts,
    });
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch related blog posts" },
      { status: 500 }
    );
  }
}
