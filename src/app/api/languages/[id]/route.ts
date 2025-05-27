import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/languages/[id] - Get a specific language
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const language = await prisma.language.findUnique({
      where: { id },
      include: {
        translations: {
          orderBy: { key: "asc" },
        },
      },
    });

    if (!language) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }

    return NextResponse.json({ language });
  } catch (error) {
    console.error("Error fetching language:", error);
    return NextResponse.json({ error: "Failed to fetch language" }, { status: 500 });
  }
}

// PUT /api/languages/[id] - Update a language
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, name, isDefault, isActive } = body;

    // If this is going to be the default language, unset other defaults
    if (isDefault) {
      await prisma.language.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const language = await prisma.language.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ language });
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 });
  }
}

// DELETE /api/languages/[id] - Delete a language
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if this is the default language
    const language = await prisma.language.findUnique({
      where: { id },
    });

    if (language?.isDefault) {
      return NextResponse.json({ error: "Cannot delete the default language" }, { status: 400 });
    }

    await prisma.language.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Language deleted successfully" });
  } catch (error) {
    console.error("Error deleting language:", error);
    return NextResponse.json({ error: "Failed to delete language" }, { status: 500 });
  }
}
