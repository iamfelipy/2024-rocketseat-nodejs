-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_shipment_id_fkey";

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
