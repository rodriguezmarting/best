/*
  Warnings:

  - You are about to drop the column `deleted` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "deleted";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "deleted";
