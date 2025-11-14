-- AlterTable
ALTER TABLE "lead" ADD COLUMN     "assignedTo" TEXT;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
