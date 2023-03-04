/*
  Warnings:

  - You are about to drop the column `imgMain` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `imgPrice` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imgMain",
DROP COLUMN "imgPrice",
ADD COLUMN     "img" TEXT,
ADD COLUMN     "isAction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
DROP COLUMN "city",
DROP COLUMN "email",
ADD COLUMN     "contacts" TEXT;
