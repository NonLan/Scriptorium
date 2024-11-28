/*
  Warnings:

  - You are about to drop the `_BlogPostToTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_BlogPostToTemplate_B_index";

-- DropIndex
DROP INDEX "_BlogPostToTemplate_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BlogPostToTemplate";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "templatesid" INTEGER,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME,
    CONSTRAINT "BlogPost_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlogPost_templatesid_fkey" FOREIGN KEY ("templatesid") REFERENCES "Template" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("authorid", "content", "createdAt", "id", "lastEdited", "rating", "title") SELECT "authorid", "content", "createdAt", "id", "lastEdited", "rating", "title" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
