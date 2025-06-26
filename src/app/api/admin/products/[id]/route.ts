import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/products/[id] - Get a specific product
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productImages: {
          orderBy: { sortOrder: "asc" },
        },
        productAttributes: {
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
            attribute: {
              include: {
                translations: {
                  include: {
                    language: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      sku,
      categoryId,
      isActive,
      isFeatured,
      stockQuantity,
      attributes,
      images,
    } = body;

    // Check if SKU already exists for other products
    if (sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          sku,
          id: { not: id },
        },
      });

      if (existingSku) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    // Update product with transaction to handle attributes and images
    const product = await prisma.$transaction(async (tx) => {
      // Update basic product info
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price) : undefined,
          sku,
          categoryId,
          isActive,
          isFeatured,
          stockQuantity,
        },
      });

      // Update attributes if provided
      if (attributes) {
        // Delete existing attributes
        await tx.productAttribute.deleteMany({
          where: { productId: id },
        });

        // Create new attributes
        if (attributes.length > 0) {
          await tx.productAttribute.createMany({
            data: attributes.map((attr: any) => ({
              productId: id,
              attributeTypeId: attr.attributeTypeId,
              attributeId: attr.attributeId,
              customValue: attr.customValue,
            })),
          });
        }
      }

      // Update images if provided
      if (images) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        // Create new images
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any, index: number) => ({
              productId: id,
              imageUrl: img.imageUrl,
              altText: img.altText,
              isPrimary: img.isPrimary || index === 0,
              sortOrder: img.sortOrder || index,
            })),
          });
        }
      }

      // Return updated product with relations
      return await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          productImages: {
            orderBy: { sortOrder: "asc" },
          },
          productAttributes: {
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
              attribute: {
                include: {
                  translations: {
                    include: {
                      language: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete product (cascade will handle related records)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
