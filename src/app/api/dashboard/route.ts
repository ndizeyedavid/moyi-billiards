import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "stats") {
      const [
        totalProducts,
        totalBlogPosts,
        totalContacts,
        totalTeamMembers,
        publishedPosts,
        activePosts,
        newContacts,
        repliedContacts
      ] = await Promise.all([
        prisma.product.count(),
        prisma.blogPost.count(),
        prisma.contact.count(),
        prisma.teamMember.count(),
        prisma.blogPost.count({ where: { status: 'Published' } }),
        prisma.product.count({ where: { status: 'Active' } }),
        prisma.contact.count({ where: { status: 'New' } }),
        prisma.contact.count({ where: { status: 'Replied' } })
      ]);

      return NextResponse.json({
        totalProducts,
        totalBlogPosts,
        totalContacts,
        totalTeamMembers,
        publishedPosts,
        activePosts,
        newContacts,
        repliedContacts
      });
    }

    if (type === "recent-products") {
      const limit = parseInt(searchParams.get("limit") || "5");
      const products = await prisma.product.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          status: true,
          images: true,
          createdAt: true,
          slug: true
        }
      });
      return NextResponse.json(products);
    }

    if (type === "recent-posts") {
      const limit = parseInt(searchParams.get("limit") || "5");
      const blogPosts = await prisma.blogPost.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          publishedAt: true,
          author: true,
          readTime: true
        }
      });
      return NextResponse.json(blogPosts);
    }

    if (type === "recent-contacts") {
      const limit = parseInt(searchParams.get("limit") || "5");
      const contacts = await prisma.contact.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true
        }
      });
      return NextResponse.json(contacts);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
