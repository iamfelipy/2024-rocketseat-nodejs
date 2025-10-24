import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'
import { ShipmentAttachment } from '@/domain/core/enterprise/entities/shipment-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaShipmentAttachmentMapper } from '../mappers/prisma-shipment-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaShipmentAttachmentsRepository
  implements ShipmentAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: ShipmentAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaShipmentAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: ShipmentAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString(),
    )

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async findManyByShipmentId(
    shipmentId: string,
  ): Promise<ShipmentAttachment[]> {
    const shipmentAttachments = await this.prisma.attachment.findMany({
      where: {
        shipmentId,
      },
    })

    return shipmentAttachments.map(PrismaShipmentAttachmentMapper.toDomain)
  }

  async deleteManyByShipmentId(shipmentId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        shipmentId,
      },
    })
  }
}
