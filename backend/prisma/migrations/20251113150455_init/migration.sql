/*
  Warnings:

  - You are about to drop the column `invoiceNoId` on the `lead` table. All the data in the column will be lost.
  - Added the required column `invoiceNo` to the `lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lead" DROP CONSTRAINT "lead_invoiceNoId_fkey";

-- AlterTable
ALTER TABLE "lead" DROP COLUMN "invoiceNoId",
ADD COLUMN     "invoiceNo" TEXT NOT NULL;
