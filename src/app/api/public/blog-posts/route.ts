import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/blog-posts - Get published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");

    const where: any = {
      status: "Published", // Only show published posts to public
    };

    if (featured === "true") {
      where.featured = true;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    const blogPosts = await prisma.blogPost.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: "desc" }, // Featured posts first
        { publishedAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author: true,
        category: true,
        tags: true,
        featured: true,
        featuredImage: true,
        readTime: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      blogPosts,
    });
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
