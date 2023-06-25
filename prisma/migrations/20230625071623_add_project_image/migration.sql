/*
  Warnings:

  - Added the required column `image` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
INSERT INTO "new_Project" ("content", "id", "link", "name", "summary") SELECT "content", "id", "link", "name", "summary" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
