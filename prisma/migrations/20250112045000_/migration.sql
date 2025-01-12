/*
  Warnings:

  - You are about to alter the column `amount` on the `OrderDetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `bill` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `OrderDetail` MODIFY `amount` INTEGER NOT NULL;
