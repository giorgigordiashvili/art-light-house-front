import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/languages - Get all languages
export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: "desc" }, // Default language first
        { name: "asc" },
      ],
    });

    return NextResponse.json({ languages });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json({ error: "Failed to fetch languages" }, { status: 500 });
  }
}

// POST /api/languages - Create a new language
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, isDefault, isActive } = body;

    if (!code || !name) {
      return NextResponse.json({ error: "Code and name are required" }, { status: 400 });
    }

    // If this is going to be the default language, unset other defaults
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
        isDefault: isDefault || false,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ language }, { status: 201 });
  } catch (error) {
    console.error("Error creating language:", error);
    return NextResponse.json({ error: "Failed to create language" }, { status: 500 });
  }
}
