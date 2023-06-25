/*
  Warnings:

  - You are about to drop the column `projectId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Case` table. All the data in the column will be lost.
  - Added the required column `content` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "caseId" TEXT,
    CONSTRAINT "Tag_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("caseId", "id", "name") SELECT "caseId", "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logo" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
INSERT INTO "new_Case" ("id", "image", "logo", "name") SELECT "id", "image", "logo", "name" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_name_key" ON "Case"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
