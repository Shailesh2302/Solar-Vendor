/*
  Warnings:

  - You are about to drop the column `invoiceNo` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the `invoiceCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "lead" DROP COLUMN "invoiceNo";

-- DropTable
DROP TABLE "invoiceCounter";
