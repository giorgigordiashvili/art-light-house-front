import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/categories/[id] - Get a specific category
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    const category = await prisma.category.findUnique({
      where: { id },
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

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Transform category to include display names for the requested language
    const translation = category.translations.find((t) => t.language.code === language);
    const parentTranslation = category.parent?.translations.find(
      (t) => t.language.code === language
    );

    const transformedCategory = {
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

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, parentId, isActive, sortOrder, translations } = body;

    // Check if category name already exists for other categories
    if (name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update category with transaction to handle translations
    const category = await prisma.$transaction(async (tx) => {
      // Update basic category info
      await tx.category.update({
        where: { id },
        data: {
          name,
          description,
          parentId,
          isActive,
          sortOrder,
        },
      });

      // Update translations if provided
      if (translations) {
        // Delete existing translations
        await tx.categoryTranslation.deleteMany({
          where: { categoryId: id },
        });

        // Create new translations
        if (translations.length > 0) {
          await tx.categoryTranslation.createMany({
            data: translations.map((translation: any) => ({
              categoryId: id,
              languageId: translation.languageId,
              displayName: translation.displayName,
              description: translation.description,
            })),
          });
        }
      }

      // Return updated category with relations
      return await tx.category.findUnique({
        where: { id },
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
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!categoryWithProducts) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that has products. Please move or delete the products first.",
        },
        { status: 400 }
      );
    }

    if (categoryWithProducts._count.children > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that has subcategories. Please delete the subcategories first.",
        },
        { status: 400 }
      );
    }

    // Delete category (cascade will handle related records)
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
