import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ShipmentAttachment, ShipmentAttachmentProps } from "@/domain/core/enterprise/entities/shipment-attachment";

export function makeShipmentAttachment(override: Partial<ShipmentAttachmentProps> = {}, id?: UniqueEntityID) {
  const shipmentAttachment = ShipmentAttachment.create({
    attachmentId: new UniqueEntityID(),
    shipmentId: new UniqueEntityID(),
    ...override
  }, id)

  return shipmentAttachment
}