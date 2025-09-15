import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/analytics - Get public analytics data
export async function GET(request: NextRequest) {
  try {
    const [
      totalProducts,
      totalBlogPosts,
      totalTeamMembers,
      featuredProducts,
      recentPosts,
      productCategories,
      postCategories
    ] = await Promise.all([
      prisma.product.count({ where: { status: "Active" } }),
      prisma.blogPost.count({ where: { status: "Published" } }),
      prisma.teamMember.count({ where: { status: "Active" } }),
      prisma.product.count({ where: { status: "Active", featured: true } }),
      prisma.blogPost.count({
        where: {
          status: "Published",
          publishedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.product.groupBy({
        by: ["category"],
        where: { status: "Active" },
        _count: { category: true },
      }),
      prisma.blogPost.groupBy({
        by: ["category"],
        where: { status: "Published" },
        _count: { category: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        totalProducts,
        totalBlogPosts,
        totalTeamMembers,
        featuredProducts,
        recentPosts,
        productCategories: productCategories.map((cat) => ({
          category: cat.category,
          count: cat._count.category,
        })),
        postCategories: postCategories.map((cat) => ({
          category: cat.category,
          count: cat._count.category,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
