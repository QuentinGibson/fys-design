/*
  Warnings:

  - Added the required column `slug` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logo" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "case" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Case" ("case", "content", "created_at", "id", "image", "logo", "name") SELECT "case", "content", "created_at", "id", "image", "logo", "name" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_name_key" ON "Case"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
