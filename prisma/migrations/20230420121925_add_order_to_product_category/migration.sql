/*
  Warnings:

  - Added the required column `order` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "order" INTEGER NOT NULL;
