/*
  Warnings:

  - You are about to drop the column `projectId` on the `Industry` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Perk` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Type` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PerkToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PerkToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Perk" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PerkToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Industry" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "Industry";
DROP TABLE "Industry";
ALTER TABLE "new_Industry" RENAME TO "Industry";
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");
CREATE TABLE "new_Perk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Perk" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "Perk";
DROP TABLE "Perk";
ALTER TABLE "new_Perk" RENAME TO "Perk";
CREATE UNIQUE INDEX "Perk_name_key" ON "Perk"("name");
CREATE TABLE "new_Type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Type" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PerkToService_AB_unique" ON "_PerkToService"("A", "B");

-- CreateIndex
CREATE INDEX "_PerkToService_B_index" ON "_PerkToService"("B");
