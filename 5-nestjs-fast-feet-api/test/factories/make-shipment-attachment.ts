import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ShipmentAttachment,
  ShipmentAttachmentProps,
} from '@/domain/core/enterprise/entities/shipment-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeShipmentAttachment(
  override: Partial<ShipmentAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const shipmentAttachment = ShipmentAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      shipmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return shipmentAttachment
}

@Injectable()
export class ShipmentAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaShipmentAttachment(
    data: Partial<ShipmentAttachmentProps> = {},
  ): Promise<ShipmentAttachment> {
    const shipmentAttachment = makeShipmentAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: shipmentAttachment.attachmentId.toString(),
      },
      data: {
        shipmentId: shipmentAttachment.shipmentId.toString(),
      },
    })

    return shipmentAttachment
  }
}
