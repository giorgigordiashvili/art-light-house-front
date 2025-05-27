import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/translations/dictionary/[languageCode] - Get all translations for a language as a flat object
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ languageCode: string }> }
) {
  try {
    const { languageCode } = await params;
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get("namespace");

    const whereClause: any = {
      language: { code: languageCode },
    };

    if (namespace) {
      whereClause.namespace = namespace;
    }

    const translations = await prisma.translation.findMany({
      where: whereClause,
      select: {
        key: true,
        value: true,
        namespace: true,
      },
    });

    // Convert to nested object structure
    const dictionary: Record<string, any> = {};

    translations.forEach(({ key, value, namespace }) => {
      // Handle namespaced keys
      const fullKey = namespace ? `${namespace}.${key}` : key;

      // Split by dots and create nested structure
      const keys = fullKey.split(".");
      let current = dictionary;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
    });

    return NextResponse.json({
      dictionary,
      language: languageCode,
      totalTranslations: translations.length,
    });
  } catch (error) {
    console.error("Error fetching dictionary:", error);
    return NextResponse.json({ error: "Failed to fetch dictionary" }, { status: 500 });
  }
}
