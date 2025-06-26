import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/products - Get all products with their attributes and images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products with relations
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
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

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // Check if SKU already exists
    if (sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku },
      });

      if (existingSku) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    // Create product with attributes and images
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        sku,
        categoryId,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        stockQuantity: stockQuantity !== undefined ? stockQuantity : 0,
        ...(attributes &&
          attributes.length > 0 && {
            productAttributes: {
              create: attributes.map((attr: any) => ({
                attributeTypeId: attr.attributeTypeId,
                attributeId: attr.attributeId,
                customValue: attr.customValue,
              })),
            },
          }),
        ...(images &&
          images.length > 0 && {
            productImages: {
              create: images.map((img: any, index: number) => ({
                imageUrl: img.imageUrl,
                altText: img.altText,
                isPrimary: img.isPrimary || index === 0,
                sortOrder: img.sortOrder || index,
              })),
            },
          }),
      },
      include: {
        category: true,
        productImages: true,
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this SKU already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
