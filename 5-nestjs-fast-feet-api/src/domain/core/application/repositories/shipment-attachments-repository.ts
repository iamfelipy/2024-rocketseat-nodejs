import { ShipmentAttachment } from '../../enterprise/entities/shipment-attachment'

export interface ShipmentAttachmentsRepository {
  createMany(attachments: ShipmentAttachment[]): Promise<void>
  deleteMany(attachments: ShipmentAttachment[]): Promise<void>
  findManyByShipmentId(shipmentId: string): Promise<ShipmentAttachment[]>
  deleteManyByShipmentId(shipmentId: string): Promise<void>
}
