import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, name, isDefault, isActive } = body;

    // If this is set as default, unset any existing default
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
        code,
        name,
        isDefault,
        isActive,
      },
    });

    return NextResponse.json(language);
  } catch (error) {
    console.error("Error updating language:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A language with this code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if the language is the default language
    const language = await prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }

    if (language.isDefault) {
      return NextResponse.json({ error: "Cannot delete the default language" }, { status: 400 });
    }

    // Check if the language has translations
    const translationCount = await prisma.translation.count({
      where: { languageId: id },
    });

    const attributeTypeTranslationCount = await prisma.attributeTypeTranslation.count({
      where: { languageId: id },
    });

    const attributeTranslationCount = await prisma.attributeTranslation.count({
      where: { languageId: id },
    });

    if (
      translationCount > 0 ||
      attributeTypeTranslationCount > 0 ||
      attributeTranslationCount > 0
    ) {
      return NextResponse.json(
        { error: "Cannot delete language that has translations. Remove all translations first." },
        { status: 400 }
      );
    }

    await prisma.language.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting language:", error);
    return NextResponse.json({ error: "Failed to delete language" }, { status: 500 });
  }
}
