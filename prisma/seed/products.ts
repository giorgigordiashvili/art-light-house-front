import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedProducts() {
  console.log("🌱 Seeding categories and products...");

  try {
    // First get the default language
    const defaultLanguage = await prisma.language.findFirst({
      where: { isDefault: true },
    });

    if (!defaultLanguage) {
      throw new Error("Default language not found. Please run language seeding first.");
    }

    // Get English and Georgian languages
    const englishLang = await prisma.language.findFirst({
      where: { code: "en" },
    });
    const georgianLang = await prisma.language.findFirst({
      where: { code: "ka" },
    });

    if (!englishLang || !georgianLang) {
      throw new Error(
        "English and Georgian languages not found. Please run language seeding first."
      );
    }

    // Create categories
    console.log("Creating categories...");

    const lightingCategory = await prisma.category.create({
      data: {
        name: "lighting",
        description: "Lighting fixtures and lamps",
        isActive: true,
        sortOrder: 1,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayName: "Lighting",
              description: "Lighting fixtures and lamps",
            },
            {
              languageId: georgianLang.id,
              displayName: "განათება",
              description: "სანათების ფიქსტურები და ლამპები",
            },
          ],
        },
      },
    });

    const furnitureCategory = await prisma.category.create({
      data: {
        name: "furniture",
        description: "Furniture and home decor",
        isActive: true,
        sortOrder: 2,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayName: "Furniture",
              description: "Furniture and home decor",
            },
            {
              languageId: georgianLang.id,
              displayName: "ავეჯი",
              description: "ავეჯი და სახლის დეკორი",
            },
          ],
        },
      },
    });

    // Create subcategories
    const tableLampsCategory = await prisma.category.create({
      data: {
        name: "table-lamps",
        description: "Table lamps and desk lighting",
        parentId: lightingCategory.id,
        isActive: true,
        sortOrder: 1,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayName: "Table Lamps",
              description: "Table lamps and desk lighting",
            },
            {
              languageId: georgianLang.id,
              displayName: "მაგიდის ლამპები",
              description: "მაგიდის ლამპები და მაგიდის განათება",
            },
          ],
        },
      },
    });

    const pendantLampsCategory = await prisma.category.create({
      data: {
        name: "pendant-lamps",
        description: "Pendant and hanging lamps",
        parentId: lightingCategory.id,
        isActive: true,
        sortOrder: 2,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayName: "Pendant Lamps",
              description: "Pendant and hanging lamps",
            },
            {
              languageId: georgianLang.id,
              displayName: "ჩამოკიდული ლამპები",
              description: "ჩამოკიდული და ჩამოკიდული ლამპები",
            },
          ],
        },
      },
    });

    // Get some attribute types for products
    const colorAttributeType = await prisma.attributeType.findFirst({
      where: { name: "color" },
    });
    const sizeAttributeType = await prisma.attributeType.findFirst({
      where: { name: "size" },
    });
    const materialAttributeType = await prisma.attributeType.findFirst({
      where: { name: "material" },
    });

    // Create some products
    console.log("Creating products...");

    const product1 = await prisma.product.create({
      data: {
        name: "Modern Table Lamp",
        description: "A sleek and modern table lamp perfect for any contemporary space",
        price: 129.99,
        sku: "TL-001",
        categoryId: tableLampsCategory.id,
        isActive: true,
        isFeatured: true,
        stockQuantity: 15,
        productImages: {
          create: [
            {
              imageUrl: "/assets/desktopLampa.svg",
              altText: "Modern Table Lamp - Main View",
              isPrimary: true,
              sortOrder: 0,
            },
            {
              imageUrl: "/assets/mobileLampa.svg",
              altText: "Modern Table Lamp - Side View",
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        },
        ...(colorAttributeType && {
          productAttributes: {
            create: [
              {
                attributeTypeId: colorAttributeType.id,
                customValue: "Black",
              },
            ],
          },
        }),
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: "Elegant Pendant Light",
        description: "A beautiful pendant light that adds sophistication to any room",
        price: 249.99,
        sku: "PL-001",
        categoryId: pendantLampsCategory.id,
        isActive: true,
        isFeatured: true,
        stockQuantity: 10,
        productImages: {
          create: [
            {
              imageUrl: "/assets/PillarLight.png",
              altText: "Elegant Pendant Light - Main View",
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        ...(colorAttributeType &&
          materialAttributeType && {
            productAttributes: {
              create: [
                {
                  attributeTypeId: colorAttributeType.id,
                  customValue: "Gold",
                },
                {
                  attributeTypeId: materialAttributeType.id,
                  customValue: "Metal",
                },
              ],
            },
          }),
      },
    });

    const product3 = await prisma.product.create({
      data: {
        name: "Minimalist Desk Lamp",
        description: "A simple and functional desk lamp for focused work",
        price: 79.99,
        sku: "DL-001",
        categoryId: tableLampsCategory.id,
        isActive: true,
        isFeatured: false,
        stockQuantity: 25,
        productImages: {
          create: [
            {
              imageUrl: "/assets/light.png",
              altText: "Minimalist Desk Lamp - Main View",
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        ...(colorAttributeType &&
          sizeAttributeType && {
            productAttributes: {
              create: [
                {
                  attributeTypeId: colorAttributeType.id,
                  customValue: "White",
                },
                {
                  attributeTypeId: sizeAttributeType.id,
                  customValue: "Small",
                },
              ],
            },
          }),
      },
    });

    const product4 = await prisma.product.create({
      data: {
        name: "Vintage Floor Lamp",
        description: "A vintage-style floor lamp that brings character to your space",
        price: 199.99,
        sku: "FL-001",
        categoryId: lightingCategory.id,
        isActive: true,
        isFeatured: false,
        stockQuantity: 8,
        productImages: {
          create: [
            {
              imageUrl: "/assets/moon.png",
              altText: "Vintage Floor Lamp - Main View",
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        ...(colorAttributeType &&
          materialAttributeType && {
            productAttributes: {
              create: [
                {
                  attributeTypeId: colorAttributeType.id,
                  customValue: "Bronze",
                },
                {
                  attributeTypeId: materialAttributeType.id,
                  customValue: "Wood",
                },
              ],
            },
          }),
      },
    });

    // Create a few inactive products for testing
    await prisma.product.create({
      data: {
        name: "Discontinued Lamp",
        description: "A discontinued lamp model",
        price: 99.99,
        sku: "DISC-001",
        categoryId: tableLampsCategory.id,
        isActive: false,
        isFeatured: false,
        stockQuantity: 0,
      },
    });

    console.log("✅ Successfully created:");
    console.log(`- ${await prisma.category.count()} categories`);
    console.log(`- ${await prisma.product.count()} products`);
    console.log(`- ${await prisma.productImage.count()} product images`);
    console.log(`- ${await prisma.productAttribute.count()} product attributes`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}
