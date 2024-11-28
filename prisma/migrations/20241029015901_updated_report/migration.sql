/*
  Warnings:

  - You are about to drop the `_BlogPostToReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentToReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_BlogPostToReport_B_index";

-- DropIndex
DROP INDEX "_BlogPostToReport_AB_unique";

-- DropIndex
DROP INDEX "_CommentToReport_B_index";

-- DropIndex
DROP INDEX "_CommentToReport_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BlogPostToReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CommentToReport";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reporterid" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "Commentid" INTEGER,
    "BlogPostid" INTEGER,
    CONSTRAINT "Report_reporterid_fkey" FOREIGN KEY ("reporterid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_Commentid_fkey" FOREIGN KEY ("Commentid") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_BlogPostid_fkey" FOREIGN KEY ("BlogPostid") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("id", "reason", "reporterid") SELECT "id", "reason", "reporterid" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
