import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/translations - Get translations with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageCode = searchParams.get("language");
    const namespace = searchParams.get("namespace");
    const key = searchParams.get("key");

    const whereClause: any = {};

    if (languageCode) {
      whereClause.language = { code: languageCode };
    }

    if (namespace) {
      whereClause.namespace = namespace;
    }

    if (key) {
      whereClause.key = { contains: key, mode: "insensitive" };
    }

    const translations = await prisma.translation.findMany({
      where: whereClause,
      include: {
        language: true,
      },
      orderBy: [{ namespace: "asc" }, { key: "asc" }],
    });

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 });
  }
}

// POST /api/translations - Create a new translation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, languageId, namespace } = body;

    if (!key || !value || !languageId) {
      return NextResponse.json(
        { error: "Key, value, and languageId are required" },
        { status: 400 }
      );
    }

    const translation = await prisma.translation.create({
      data: {
        key,
        value,
        languageId,
        namespace,
      },
      include: {
        language: true,
      },
    });

    return NextResponse.json({ translation }, { status: 201 });
  } catch (error) {
    console.error("Error creating translation:", error);
    return NextResponse.json({ error: "Failed to create translation" }, { status: 500 });
  }
}
