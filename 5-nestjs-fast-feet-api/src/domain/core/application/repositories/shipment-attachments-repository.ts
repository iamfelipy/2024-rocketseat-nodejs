import { ShipmentAttachment } from '../../enterprise/entities/shipment-attachment'

export abstract class ShipmentAttachmentsRepository {
  abstract createMany(attachments: ShipmentAttachment[]): Promise<void>
  abstract deleteMany(attachments: ShipmentAttachment[]): Promise<void>
  abstract findManyByShipmentId(
    shipmentId: string,
  ): Promise<ShipmentAttachment[]>

  abstract deleteManyByShipmentId(shipmentId: string): Promise<void>
}
