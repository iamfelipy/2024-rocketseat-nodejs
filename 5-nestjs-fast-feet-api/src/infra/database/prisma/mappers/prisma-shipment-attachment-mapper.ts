import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentAttachment } from '@/domain/core/enterprise/entities/shipment-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaShipmentAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ShipmentAttachment {
    if (!raw.shipmentId) {
      throw new Error('Invalid attachment type')
    }

    return ShipmentAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        shipmentId: new UniqueEntityID(raw.shipmentId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: ShipmentAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    return {
      where: {
        id: { in: attachmentIds },
      },
      data: {
        shipmentId: attachments[0].shipmentId.toString(),
      },
    }
  }
}
