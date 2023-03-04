/*
  Warnings:

  - You are about to drop the column `photo` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "photo",
ADD COLUMN     "imgMain" TEXT,
ADD COLUMN     "imgPrice" TEXT;
