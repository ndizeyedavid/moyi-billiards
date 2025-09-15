import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "Admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Create default admin user
    const hashedPassword = await hashPassword("admin123");

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@moyibilliards.rw",
        name: "Wilson Moyi",
        password: hashedPassword,
        role: "Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
