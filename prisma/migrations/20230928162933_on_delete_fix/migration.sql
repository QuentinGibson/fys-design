-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Type_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_Type" ("created_at", "id", "name", "projectId", "updated_at") SELECT "created_at", "id", "name", "projectId", "updated_at" FROM "Type";
DROP TABLE "Type";
ALTER TABLE "new_Type" RENAME TO "Type";
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
CREATE TABLE "new_ContactFormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "serviceId" TEXT,
    CONSTRAINT "ContactFormSubmission_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_ContactFormSubmission" ("email", "firstName", "id", "lastName", "message", "serviceId") SELECT "email", "firstName", "id", "lastName", "message", "serviceId" FROM "ContactFormSubmission";
DROP TABLE "ContactFormSubmission";
ALTER TABLE "new_ContactFormSubmission" RENAME TO "ContactFormSubmission";
CREATE TABLE "new_Perk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "serviceId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Perk_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_Perk" ("created_at", "id", "name", "serviceId", "updated_at") SELECT "created_at", "id", "name", "serviceId", "updated_at" FROM "Perk";
DROP TABLE "Perk";
ALTER TABLE "new_Perk" RENAME TO "Perk";
CREATE UNIQUE INDEX "Perk_name_key" ON "Perk"("name");
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "caseId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tag_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("caseId", "created_at", "id", "name", "updated_at") SELECT "caseId", "created_at", "id", "name", "updated_at" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
