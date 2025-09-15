import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

// GET /api/blog-posts - Get all blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const skip = (page - 1) * limit;

    // Build where clause
    // @ts-ignore
    const where: Prisma.BlogPostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (featured === "true") {
      where.featured = true;
    }

    // Get blog posts and total count
    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      blogPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog-posts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = blogPostSchema.parse(body);

    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Calculate word count and read time
    if (validatedData.content) {
      const wordCount = validatedData.content.split(/\s+/).length;
      validatedData.wordCount = wordCount;
      validatedData.readTime = Math.ceil(wordCount / 200); // Average reading speed
    }

    const blogPost = await prisma.blogPost.create({
      data: validatedData,
    });

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Blog post with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
