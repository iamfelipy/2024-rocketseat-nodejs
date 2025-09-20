import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'
import { ShipmentAttachment } from '@/domain/core/enterprise/entities/shipment-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaShipmentAttachmentsRepository
  implements ShipmentAttachmentsRepository
{
  createMany(attachments: ShipmentAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteMany(attachments: ShipmentAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByShipmentId(shipmentId: string): Promise<ShipmentAttachment[]> {
    throw new Error('Method not implemented.')
  }
}
