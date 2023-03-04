/*
  Warnings:

  - You are about to drop the column `isAction` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `isReview` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "payable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "isAction",
DROP COLUMN "isReview";
