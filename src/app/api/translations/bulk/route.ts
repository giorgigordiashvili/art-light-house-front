import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/translations/bulk - Bulk create/update translations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { translations, languageId, operation = "upsert" } = body;

    if (!translations || !Array.isArray(translations) || !languageId) {
      return NextResponse.json(
        { error: "Translations array and languageId are required" },
        { status: 400 }
      );
    }

    const results = [];

    if (operation === "upsert") {
      // Use upsert for each translation
      for (const translation of translations) {
        const { key, value, namespace } = translation;

        if (!key || !value) {
          continue; // Skip invalid entries
        }

        const result = await prisma.translation.upsert({
          where: {
            key_languageId: {
              key,
              languageId,
            },
          },
          update: {
            value,
            namespace,
          },
          create: {
            key,
            value,
            languageId,
            namespace,
          },
          include: {
            language: true,
          },
        });

        results.push(result);
      }
    } else if (operation === "create") {
      // Bulk create only
      const data = translations
        .filter((t) => t.key && t.value)
        .map((t) => ({
          key: t.key,
          value: t.value,
          languageId,
          namespace: t.namespace,
        }));

      if (data.length > 0) {
        await prisma.translation.createMany({
          data,
          skipDuplicates: true,
        });

        // Fetch the created translations
        const createdTranslations = await prisma.translation.findMany({
          where: {
            languageId,
            key: { in: data.map((d) => d.key) },
          },
          include: {
            language: true,
          },
        });

        results.push(...createdTranslations);
      }
    }

    return NextResponse.json(
      {
        translations: results,
        processed: results.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing bulk translations:", error);
    return NextResponse.json({ error: "Failed to process bulk translations" }, { status: 500 });
  }
}

// DELETE /api/translations/bulk - Bulk delete translations
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { translationIds, languageId, namespace } = body;

    const whereClause: any = {};

    if (translationIds && Array.isArray(translationIds)) {
      whereClause.id = { in: translationIds };
    } else if (languageId) {
      whereClause.languageId = languageId;
      if (namespace) {
        whereClause.namespace = namespace;
      }
    } else {
      return NextResponse.json(
        { error: "Either translationIds or languageId must be provided" },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.translation.deleteMany({
      where: whereClause,
    });

    return NextResponse.json({
      message: "Translations deleted successfully",
      deleted: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting translations:", error);
    return NextResponse.json({ error: "Failed to delete translations" }, { status: 500 });
  }
}
