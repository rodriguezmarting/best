-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
