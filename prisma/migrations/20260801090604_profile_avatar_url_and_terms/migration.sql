/*
  Warnings:

  - You are about to drop the column `avatar_path` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatar_path",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);
