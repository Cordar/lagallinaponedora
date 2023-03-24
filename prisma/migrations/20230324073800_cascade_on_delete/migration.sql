-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_choiceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "CustomizedProduct" DROP CONSTRAINT "CustomizedProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AddForeignKey
ALTER TABLE "CustomizedProduct" ADD CONSTRAINT "CustomizedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_choiceGroupId_fkey" FOREIGN KEY ("choiceGroupId") REFERENCES "ChoiceGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
