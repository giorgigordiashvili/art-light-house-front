import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      include: {
        _count: {
          select: {
            translations: true,
            attributeTypeTranslations: true,
            attributeTranslations: true,
            categoryTranslations: true,
          },
        },
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json({ error: "Failed to fetch languages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, isDefault, isActive } = body;

    if (!code || !name) {
      return NextResponse.json({ error: "Code and name are required" }, { status: 400 });
    }

    // If this is set as default, unset any existing default
    if (isDefault) {
      await prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const language = await prisma.language.create({
      data: {
        code,
        name,
        isDefault: isDefault ?? false,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(language);
  } catch (error) {
    console.error("Error creating language:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A language with this code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create language" }, { status: 500 });
  }
}
