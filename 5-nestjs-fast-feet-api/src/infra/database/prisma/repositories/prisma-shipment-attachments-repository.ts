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

  createMany(attachments: ShipmentAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteMany(attachments: ShipmentAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
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
