import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/products - Get public products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");

    const where: any = {
      status: "Active", // Only show active products to public
    };

    if (featured === "true") {
      where.featured = true;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: "desc" }, // Featured products first
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        category: true,
        featured: true,
        images: true,
        slug: true,
        stock: true,
      },
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching public products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", full_error: error },
      { status: 500 }
    );
  }
}
