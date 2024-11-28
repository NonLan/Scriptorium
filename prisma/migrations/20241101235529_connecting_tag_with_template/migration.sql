/*
  Warnings:

  - You are about to drop the `_TagToTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TagToTemplate";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_TemplateTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TemplateTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TemplateTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TemplateTags_AB_unique" ON "_TemplateTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TemplateTags_B_index" ON "_TemplateTags"("B");
