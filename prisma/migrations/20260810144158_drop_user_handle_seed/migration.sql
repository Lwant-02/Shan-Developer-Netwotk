/*
  Warnings:

  - You are about to drop the column `handle_seed` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_auth"."user" DROP COLUMN "handle_seed";
