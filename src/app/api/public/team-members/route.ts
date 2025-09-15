import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/team-members - Get active team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        status: "Active", // Only show active team members to public
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        avatar: true,
        skills: true,
        startDate: true,
      },
    });

    return NextResponse.json({
      success: true,
      teamMembers,
    });
  } catch (error) {
    console.error("Error fetching public team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
