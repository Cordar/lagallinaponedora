/*
  Warnings:

  - Made the column `choiceGroupId` on table `Choice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `CustomizedProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_choiceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "CustomizedProduct" DROP CONSTRAINT "CustomizedProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "Choice" ALTER COLUMN "choiceGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CustomizedProduct" ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomizedProduct" ADD CONSTRAINT "CustomizedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_choiceGroupId_fkey" FOREIGN KEY ("choiceGroupId") REFERENCES "ChoiceGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
