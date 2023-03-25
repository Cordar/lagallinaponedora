-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('COMBO', 'DISH', 'DRINK', 'DESSERT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('STARTED', 'PAID', 'COOKED', 'DELIVERED');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageSrc" TEXT,
    "category" "ProductCategory" NOT NULL,
    "cookingTimeInMinutes" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizedProduct" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "CustomizedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChoiceGroup" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ChoiceGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "choiceGroupId" INTEGER NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'STARTED',
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustomizedProductToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChoiceGroupToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChoiceToCustomizedProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_sessionId_key" ON "Customer"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomizedProductToOrder_AB_unique" ON "_CustomizedProductToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomizedProductToOrder_B_index" ON "_CustomizedProductToOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChoiceGroupToProduct_AB_unique" ON "_ChoiceGroupToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ChoiceGroupToProduct_B_index" ON "_ChoiceGroupToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChoiceToCustomizedProduct_AB_unique" ON "_ChoiceToCustomizedProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ChoiceToCustomizedProduct_B_index" ON "_ChoiceToCustomizedProduct"("B");

-- AddForeignKey
ALTER TABLE "CustomizedProduct" ADD CONSTRAINT "CustomizedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_choiceGroupId_fkey" FOREIGN KEY ("choiceGroupId") REFERENCES "ChoiceGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomizedProductToOrder" ADD CONSTRAINT "_CustomizedProductToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomizedProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomizedProductToOrder" ADD CONSTRAINT "_CustomizedProductToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChoiceGroupToProduct" ADD CONSTRAINT "_ChoiceGroupToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "ChoiceGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChoiceGroupToProduct" ADD CONSTRAINT "_ChoiceGroupToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChoiceToCustomizedProduct" ADD CONSTRAINT "_ChoiceToCustomizedProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Choice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChoiceToCustomizedProduct" ADD CONSTRAINT "_ChoiceToCustomizedProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "CustomizedProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
