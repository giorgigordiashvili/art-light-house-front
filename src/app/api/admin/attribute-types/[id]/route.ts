import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const attributeType = await prisma.attributeType.findUnique({
      where: { id },
      include: {
        attributes: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!attributeType) {
      return NextResponse.json({ error: "Attribute type not found" }, { status: 404 });
    }

    return NextResponse.json(attributeType);
  } catch (error) {
    console.error("Error fetching attribute type:", error);
    return NextResponse.json({ error: "Failed to fetch attribute type" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, inputType, isRequired, isActive, sortOrder } = body;

    const attributeType = await prisma.attributeType.update({
      where: { id },
      data: {
        name,
        inputType,
        isRequired,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json(attributeType);
  } catch (error) {
    console.error("Error updating attribute type:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Attribute type not found" }, { status: 404 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "An attribute type with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update attribute type" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if the attribute type is being used
    const usage = await prisma.productAttribute.findFirst({
      where: { attributeTypeId: id },
    });

    if (usage) {
      return NextResponse.json(
        { error: "Cannot delete attribute type that is in use by products" },
        { status: 400 }
      );
    }

    await prisma.attributeType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attribute type:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Attribute type not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete attribute type" }, { status: 500 });
  }
}
