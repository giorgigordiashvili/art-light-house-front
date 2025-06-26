import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const attributeTypes = await prisma.attributeType.findMany({
      include: {
        attributes: {
          where: { isActive: true },
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
          orderBy: { sortOrder: "asc" },
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
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(attributeTypes);
  } catch (error) {
    console.error("Error fetching attribute types:", error);
    return NextResponse.json({ error: "Failed to fetch attribute types" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, inputType, isRequired, isActive, sortOrder, translations } = body;

    if (!name || !inputType || !translations || Object.keys(translations).length === 0) {
      return NextResponse.json(
        { error: "Name, inputType, and translations are required" },
        { status: 400 }
      );
    }

    const attributeType = await prisma.attributeType.create({
      data: {
        name,
        inputType,
        isRequired: isRequired ?? false,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        translations: {
          create: Object.entries(translations).map(([languageId, data]: [string, any]) => ({
            languageId,
            displayName: data.displayName,
            description: data.description || null,
          })),
        },
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    return NextResponse.json(attributeType);
  } catch (error) {
    console.error("Error creating attribute type:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "An attribute type with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create attribute type" }, { status: 500 });
  }
}
