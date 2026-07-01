/*
  Warnings:

  - You are about to drop the column `authId` on the `comments` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authId_fkey";

-- DropIndex
DROP INDEX "comments_authId_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
