import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentAttachment } from '@/domain/core/enterprise/entities/shipment-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaShipmentAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ShipmentAttachment {
    return ShipmentAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        shipmentId: new UniqueEntityID(raw.shipmentId),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
