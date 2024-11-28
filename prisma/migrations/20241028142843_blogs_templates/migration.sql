-- CreateTable
CREATE TABLE "BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "reportReason" TEXT,
    CONSTRAINT "BlogPost_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "reportReason" TEXT,
    CONSTRAINT "Comment_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "forkedFromid" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "reportReason" TEXT,
    CONSTRAINT "Template_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Template_forkedFromid_fkey" FOREIGN KEY ("forkedFromid") REFERENCES "Template" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "_Post Tags" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Post Tags_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Post Tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Post Templates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Post Templates_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Post Templates_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Head Comments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Head Comments_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Head Comments_B_fkey" FOREIGN KEY ("B") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Replies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Replies_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Replies_B_fkey" FOREIGN KEY ("B") REFERENCES "Comment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Saved Templates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Saved Templates_A_fkey" FOREIGN KEY ("A") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Saved Templates_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Template Tags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Template Tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Template Tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Post Tags_AB_unique" ON "_Post Tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Post Tags_B_index" ON "_Post Tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Post Templates_AB_unique" ON "_Post Templates"("A", "B");

-- CreateIndex
CREATE INDEX "_Post Templates_B_index" ON "_Post Templates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Head Comments_AB_unique" ON "_Head Comments"("A", "B");

-- CreateIndex
CREATE INDEX "_Head Comments_B_index" ON "_Head Comments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Replies_AB_unique" ON "_Replies"("A", "B");

-- CreateIndex
CREATE INDEX "_Replies_B_index" ON "_Replies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Saved Templates_AB_unique" ON "_Saved Templates"("A", "B");

-- CreateIndex
CREATE INDEX "_Saved Templates_B_index" ON "_Saved Templates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Template Tags_AB_unique" ON "_Template Tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Template Tags_B_index" ON "_Template Tags"("B");
