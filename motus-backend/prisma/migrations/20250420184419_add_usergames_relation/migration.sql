/*
  Warnings:

  - You are about to drop the column `status` on the `Wall_of_Fame` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wall_of_Fame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "Wall_of_Fame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wall_of_Fame_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Wall_of_Fame" ("id", "score", "userId", "wordId") SELECT "id", "score", "userId", "wordId" FROM "Wall_of_Fame";
DROP TABLE "Wall_of_Fame";
ALTER TABLE "new_Wall_of_Fame" RENAME TO "Wall_of_Fame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
