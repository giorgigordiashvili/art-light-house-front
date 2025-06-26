import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { value, hexColor, sortOrder, isActive, translations } = body;

    const attribute = await prisma.attribute.update({
      where: { id },
      data: {
        value,
        hexColor,
        sortOrder,
        isActive,
        ...(translations && {
          translations: {
            deleteMany: {},
            create: Object.entries(translations).map(([languageId, data]: [string, any]) => ({
              languageId,
              displayValue: data.displayValue,
            })),
          },
        }),
      },
      include: {
        attributeType: {
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        },
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.error("Error updating attribute:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Attribute not found" }, { status: 404 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "An attribute with this value already exists for this type" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update attribute" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if the attribute is being used
    const usage = await prisma.productAttribute.findFirst({
      where: { attributeId: id },
    });

    if (usage) {
      return NextResponse.json(
        { error: "Cannot delete attribute that is in use by products" },
        { status: 400 }
      );
    }

    await prisma.attribute.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Attribute not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete attribute" }, { status: 500 });
  }
}
