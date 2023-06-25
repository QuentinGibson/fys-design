-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "Type_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Type" ("id", "name", "projectId") SELECT "id", "name", "projectId" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caseId" TEXT,
    "projectId" TEXT,
    CONSTRAINT "Tag_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("caseId", "id", "name", "projectId", "type") SELECT "caseId", "id", "name", "projectId", "type" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE TABLE "new_Perk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "serviceId" TEXT,
    CONSTRAINT "Perk_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Perk" ("id", "name", "serviceId") SELECT "id", "name", "serviceId" FROM "Perk";
DROP TABLE "Perk";
ALTER TABLE "new_Perk" RENAME TO "Perk";
CREATE UNIQUE INDEX "Perk_name_key" ON "Perk"("name");
CREATE TABLE "new_Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "Industry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Industry" ("id", "name", "projectId") SELECT "id", "name", "projectId" FROM "Industry";
DROP TABLE "Industry";
ALTER TABLE "new_Industry" RENAME TO "Industry";
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
