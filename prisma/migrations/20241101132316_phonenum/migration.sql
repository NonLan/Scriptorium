/*
  Warnings:

  - You are about to alter the column `phoneNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("accountType", "avatar", "email", "firstName", "id", "lastName", "password", "phoneNumber") SELECT "accountType", "avatar", "email", "firstName", "id", "lastName", "password", "phoneNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
