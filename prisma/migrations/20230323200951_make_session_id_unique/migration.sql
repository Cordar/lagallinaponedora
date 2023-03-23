/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_sessionId_key" ON "Customer"("sessionId");
