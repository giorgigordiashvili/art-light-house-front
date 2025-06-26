import { PrismaClient } from "@prisma/client";
import seedTranslations from "./translations";
import seedAttributes from "./attributes";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed translations
    await seedTranslations();

    // Seed attributes
    await seedAttributes();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
