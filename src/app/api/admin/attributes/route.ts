import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const attributeTypeId = searchParams.get("attributeTypeId");

    const where = attributeTypeId ? { attributeTypeId } : {};

    const attributes = await prisma.attribute.findMany({
      where: {
        ...where,
        isActive: true,
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
        _count: {
          select: { productAttributes: true },
        },
      },
      orderBy: [{ attributeType: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    });

    return NextResponse.json(attributes);
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json({ error: "Failed to fetch attributes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attributeTypeId, value, hexColor, sortOrder, isActive, translations } = body;

    if (!attributeTypeId || !value || !translations || Object.keys(translations).length === 0) {
      return NextResponse.json(
        { error: "AttributeTypeId, value, and translations are required" },
        { status: 400 }
      );
    }

    const attribute = await prisma.attribute.create({
      data: {
        attributeTypeId,
        value,
        hexColor,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
        translations: {
          create: Object.entries(translations).map(([languageId, data]: [string, any]) => ({
            languageId,
            displayValue: data.displayValue,
          })),
        },
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
    console.error("Error creating attribute:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "An attribute with this value already exists for this type" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create attribute" }, { status: 500 });
  }
}
