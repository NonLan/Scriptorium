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
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BlogPost_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlogPost_templatesid_fkey" FOREIGN KEY ("templatesid") REFERENCES "Template" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("authorid", "content", "createdAt", "id", "lastEdited", "rating", "templatesid", "title") SELECT "authorid", "content", "createdAt", "id", "lastEdited", "rating", "templatesid", "title" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" DATETIME,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "BlogPostid" INTEGER,
    "Commentid" INTEGER,
    CONSTRAINT "Comment_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogPostid_fkey" FOREIGN KEY ("BlogPostid") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_Commentid_fkey" FOREIGN KEY ("Commentid") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("BlogPostid", "Commentid", "authorid", "content", "createdAt", "id", "lastEdited", "rating") SELECT "BlogPostid", "Commentid", "authorid", "content", "createdAt", "id", "lastEdited", "rating" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
