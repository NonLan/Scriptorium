-- CreateTable
CREATE TABLE "Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "BlogPostid" INTEGER,
    "Commentid" INTEGER,
    CONSTRAINT "Rating_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_BlogPostid_fkey" FOREIGN KEY ("BlogPostid") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rating_Commentid_fkey" FOREIGN KEY ("Commentid") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
