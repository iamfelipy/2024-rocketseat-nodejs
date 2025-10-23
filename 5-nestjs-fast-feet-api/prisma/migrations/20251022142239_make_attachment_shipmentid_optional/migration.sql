-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_shipment_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "shipment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
