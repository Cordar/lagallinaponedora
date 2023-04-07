-- DropForeignKey
ALTER TABLE "ChosenProduct" DROP CONSTRAINT "ChosenProduct_orderId_fkey";

-- AddForeignKey
ALTER TABLE "ChosenProduct" ADD CONSTRAINT "ChosenProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
