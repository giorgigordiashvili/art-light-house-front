import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/customers - Get all customers with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get customers with pagination
    const customers = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        clerk_id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// DELETE /api/admin/customers - Bulk delete customers (optional)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerIds } = body;

    if (!customerIds || !Array.isArray(customerIds)) {
      return NextResponse.json({ error: "Customer IDs are required" }, { status: 400 });
    }

    // Delete customers from database
    const result = await prisma.user.deleteMany({
      where: {
        id: { in: customerIds },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} customers`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting customers:", error);
    return NextResponse.json({ error: "Failed to delete customers" }, { status: 500 });
  }
}
