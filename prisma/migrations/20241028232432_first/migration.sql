/*
  Warnings:

  - You are about to drop the `_Head Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Post Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Post Templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Saved Templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Template Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reportReason` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `reported` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `reportReason` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `reported` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `reportReason` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `reported` on the `Template` table. All the data in the column will be lost.
  - Added the required column `stdin` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_Head Comments_B_index";

-- DropIndex
DROP INDEX "_Head Comments_AB_unique";

-- DropIndex
DROP INDEX "_Post Tags_B_index";

-- DropIndex
DROP INDEX "_Post Tags_AB_unique";

-- DropIndex
DROP INDEX "_Post Templates_B_index";

-- DropIndex
DROP INDEX "_Post Templates_AB_unique";

-- DropIndex
DROP INDEX "_Replies_B_index";

-- DropIndex
DROP INDEX "_Replies_AB_unique";

-- DropIndex
DROP INDEX "_Saved Templates_B_index";

-- DropIndex
DROP INDEX "_Saved Templates_AB_unique";

-- DropIndex
DROP INDEX "_Template Tags_B_index";

-- DropIndex
DROP INDEX "_Template Tags_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Head Comments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Post Tags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Post Templates";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Replies";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Saved Templates";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Template Tags";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterid" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    CONSTRAINT "Report_reporterid_fkey" FOREIGN KEY ("reporterid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogPostToReport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CommentToReport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CommentToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CommentToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TagToTemplate" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME,
    CONSTRAINT "BlogPost_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("authorid", "content", "createdAt", "id", "rating", "title") SELECT "authorid", "content", "createdAt", "id", "rating", "title" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME,
    "BlogPostid" INTEGER,
    "Commentid" INTEGER,
    CONSTRAINT "Comment_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogPostid_fkey" FOREIGN KEY ("BlogPostid") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_Commentid_fkey" FOREIGN KEY ("Commentid") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("authorid", "content", "createdAt", "id", "rating") SELECT "authorid", "content", "createdAt", "id", "rating" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "stdin" TEXT NOT NULL,
    "forkedFromid" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME,
    CONSTRAINT "Template_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Template_forkedFromid_fkey" FOREIGN KEY ("forkedFromid") REFERENCES "Template" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("authorid", "code", "createdAt", "description", "forkedFromid", "id", "language", "lastEdited", "title") SELECT "authorid", "code", "createdAt", "description", "forkedFromid", "id", "language", "lastEdited", "title" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToTag_AB_unique" ON "_BlogPostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToTag_B_index" ON "_BlogPostToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToTemplate_AB_unique" ON "_BlogPostToTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToTemplate_B_index" ON "_BlogPostToTemplate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToReport_AB_unique" ON "_BlogPostToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToReport_B_index" ON "_BlogPostToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommentToReport_AB_unique" ON "_CommentToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentToReport_B_index" ON "_CommentToReport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTemplate_AB_unique" ON "_TagToTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTemplate_B_index" ON "_TagToTemplate"("B");
