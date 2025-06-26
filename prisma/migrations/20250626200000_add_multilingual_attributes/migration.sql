-- Remove displayName from attribute_types as it's now in translations
ALTER TABLE "attribute_types" DROP COLUMN IF EXISTS "displayName";

-- Remove displayValue from attributes as it's now in translations
ALTER TABLE "attributes" DROP COLUMN IF EXISTS "displayValue";

-- Remove displayName from categories as it's now in translations
ALTER TABLE "categories" DROP COLUMN IF EXISTS "displayName";

-- CreateTable
CREATE TABLE "attribute_type_translations" (
    "id" TEXT NOT NULL,
    "attributeTypeId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_type_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_translations" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "displayValue" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attribute_type_translations_attributeTypeId_languageId_key" ON "attribute_type_translations"("attributeTypeId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_translations_attributeId_languageId_key" ON "attribute_translations"("attributeId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categoryId_languageId_key" ON "category_translations"("categoryId", "languageId");

-- AddForeignKey
ALTER TABLE "attribute_type_translations" ADD CONSTRAINT "attribute_type_translations_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "attribute_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_type_translations" ADD CONSTRAINT "attribute_type_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_translations" ADD CONSTRAINT "attribute_translations_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_translations" ADD CONSTRAINT "attribute_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
