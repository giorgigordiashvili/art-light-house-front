import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/categories - Get all categories with their translations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const language = searchParams.get("language") || "en";

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        translations: {
          include: {
            language: true,
          },
        },
        parent: {
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        },
        children: {
          where: includeInactive ? {} : { isActive: true },
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Transform categories to include display names for the requested language
    const transformedCategories = categories.map((category) => {
      const translation = category.translations.find((t) => t.language.code === language);
      const parentTranslation = category.parent?.translations.find(
        (t) => t.language.code === language
      );

      return {
        ...category,
        displayName: translation?.displayName || category.name,
        displayDescription: translation?.description || category.description,
        parent: category.parent
          ? {
              ...category.parent,
              displayName: parentTranslation?.displayName || category.parent.name,
            }
          : null,
        children: category.children.map((child) => {
          const childTranslation = child.translations.find((t) => t.language.code === language);
          return {
            ...child,
            displayName: childTranslation?.displayName || child.name,
          };
        }),
        productCount: category._count.products,
      };
    });

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, parentId, isActive, sortOrder, translations } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Check if category name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    // Create category with translations
    const category = await prisma.category.create({
      data: {
        name,
        description,
        parentId,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
        ...(translations &&
          translations.length > 0 && {
            translations: {
              create: translations.map((translation: any) => ({
                languageId: translation.languageId,
                displayName: translation.displayName,
                description: translation.description,
              })),
            },
          }),
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
        parent: {
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
