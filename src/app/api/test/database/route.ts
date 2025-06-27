import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/test/database - Test database connection
export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    await prisma.$connect();
    console.log("Database connected successfully");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);

    // Test a simple operation
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Raw query result:", result);

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount,
      testQuery: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection test failed:", error);

    let errorDetails = "Unknown error";
    if (error instanceof Error) {
      errorDetails = error.message;
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
