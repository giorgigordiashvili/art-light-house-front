import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function seedAttributes() {
  console.log("🌱 Seeding attribute types and values...");

  // Get languages first
  const englishLang = await prisma.language.findUnique({ where: { code: "en" } });
  const georgianLang = await prisma.language.findUnique({ where: { code: "ka" } });

  if (!englishLang || !georgianLang) {
    throw new Error("Languages not found. Please run language seeding first.");
  }

  // Create attribute types with translations
  const colorType = await prisma.attributeType.upsert({
    where: { name: "color" },
    update: {},
    create: {
      name: "color",
      inputType: "color",
      isRequired: false,
      isActive: true,
      sortOrder: 1,
      translations: {
        create: [
          {
            languageId: englishLang.id,
            displayName: "Color",
            description: "The color of the product",
          },
          {
            languageId: georgianLang.id,
            displayName: "ფერი",
            description: "პროდუქტის ფერი",
          },
        ],
      },
    },
  });

  const sizeType = await prisma.attributeType.upsert({
    where: { name: "size" },
    update: {},
    create: {
      name: "size",
      inputType: "select",
      isRequired: false,
      isActive: true,
      sortOrder: 2,
      translations: {
        create: [
          {
            languageId: englishLang.id,
            displayName: "Size",
            description: "The size of the product",
          },
          {
            languageId: georgianLang.id,
            displayName: "ზომა",
            description: "პროდუქტის ზომა",
          },
        ],
      },
    },
  });

  const materialType = await prisma.attributeType.upsert({
    where: { name: "material" },
    update: {},
    create: {
      name: "material",
      inputType: "select",
      isRequired: false,
      isActive: true,
      sortOrder: 3,
      translations: {
        create: [
          {
            languageId: englishLang.id,
            displayName: "Material",
            description: "The material of the product",
          },
          {
            languageId: georgianLang.id,
            displayName: "მასალა",
            description: "პროდუქტის მასალა",
          },
        ],
      },
    },
  });

  // Create attribute values with translations
  const colors = [
    { value: "black", hexColor: "#000000", sortOrder: 1, en: "Black", ka: "შავი" },
    { value: "white", hexColor: "#FFFFFF", sortOrder: 2, en: "White", ka: "თეთრი" },
    { value: "gold", hexColor: "#FFD700", sortOrder: 3, en: "Gold", ka: "ოქროსფერი" },
    { value: "silver", hexColor: "#C0C0C0", sortOrder: 4, en: "Silver", ka: "ვერცხლისფერი" },
  ];

  for (const color of colors) {
    await prisma.attribute.upsert({
      where: { attributeTypeId_value: { attributeTypeId: colorType.id, value: color.value } },
      update: {},
      create: {
        attributeTypeId: colorType.id,
        value: color.value,
        hexColor: color.hexColor,
        sortOrder: color.sortOrder,
        isActive: true,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayValue: color.en,
            },
            {
              languageId: georgianLang.id,
              displayValue: color.ka,
            },
          ],
        },
      },
    });
  }

  const sizes = [
    { value: "small", sortOrder: 1, en: "Small", ka: "პატარა" },
    { value: "medium", sortOrder: 2, en: "Medium", ka: "საშუალო" },
    { value: "large", sortOrder: 3, en: "Large", ka: "დიდი" },
  ];

  for (const size of sizes) {
    await prisma.attribute.upsert({
      where: { attributeTypeId_value: { attributeTypeId: sizeType.id, value: size.value } },
      update: {},
      create: {
        attributeTypeId: sizeType.id,
        value: size.value,
        sortOrder: size.sortOrder,
        isActive: true,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayValue: size.en,
            },
            {
              languageId: georgianLang.id,
              displayValue: size.ka,
            },
          ],
        },
      },
    });
  }

  const materials = [
    { value: "metal", sortOrder: 1, en: "Metal", ka: "ლითონი" },
    { value: "glass", sortOrder: 2, en: "Glass", ka: "შუშა" },
    { value: "wood", sortOrder: 3, en: "Wood", ka: "ხე" },
  ];

  for (const material of materials) {
    await prisma.attribute.upsert({
      where: { attributeTypeId_value: { attributeTypeId: materialType.id, value: material.value } },
      update: {},
      create: {
        attributeTypeId: materialType.id,
        value: material.value,
        sortOrder: material.sortOrder,
        isActive: true,
        translations: {
          create: [
            {
              languageId: englishLang.id,
              displayValue: material.en,
            },
            {
              languageId: georgianLang.id,
              displayValue: material.ka,
            },
          ],
        },
      },
    });
  }

  // Create sample category
  await prisma.category.upsert({
    where: { name: "chandeliers" },
    update: {},
    create: {
      name: "chandeliers",
      sortOrder: 1,
      isActive: true,
      translations: {
        create: [
          {
            languageId: englishLang.id,
            displayName: "Chandeliers",
            description: "Elegant hanging light fixtures",
          },
          {
            languageId: georgianLang.id,
            displayName: "ჭაღები",
            description: "ელეგანტური ჩამოკიდებული სანათები",
          },
        ],
      },
    },
  });

  console.log("✅ Attributes seeded successfully");
}

// Run the seed function when this file is executed directly
if (require.main === module) {
  seedAttributes()
    .then(() => {
      console.log("✅ Attribute seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error seeding attributes:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
