import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/translations/[id] - Get a specific translation
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const translation = await prisma.translation.findUnique({
      where: { id },
      include: {
        language: true,
      },
    });

    if (!translation) {
      return NextResponse.json({ error: "Translation not found" }, { status: 404 });
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Error fetching translation:", error);
    return NextResponse.json({ error: "Failed to fetch translation" }, { status: 500 });
  }
}

// PUT /api/translations/[id] - Update a translation
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { key, value, namespace } = body;

    const translation = await prisma.translation.update({
      where: { id },
      data: {
        ...(key && { key }),
        ...(value && { value }),
        ...(namespace !== undefined && { namespace }),
      },
      include: {
        language: true,
      },
    });

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Error updating translation:", error);
    return NextResponse.json({ error: "Failed to update translation" }, { status: 500 });
  }
}

// DELETE /api/translations/[id] - Delete a translation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.translation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Translation deleted successfully" });
  } catch (error) {
    console.error("Error deleting translation:", error);
    return NextResponse.json({ error: "Failed to delete translation" }, { status: 500 });
  }
}
