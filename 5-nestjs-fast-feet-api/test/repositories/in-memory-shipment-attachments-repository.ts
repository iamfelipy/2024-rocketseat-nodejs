import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'
import { ShipmentAttachment } from '@/domain/core/enterprise/entities/shipment-attachment'

export class InMemoryShipmentAttachmentsRepository
  implements ShipmentAttachmentsRepository
{
  public items: ShipmentAttachment[] = []

  async deleteManyByShipmentId(shipmentId: string) {
    const shipmentAttachments = this.items.filter(
      (item) => item.shipmentId.toString() !== shipmentId,
    )

    this.items = shipmentAttachments
  }

  async findManyByShipmentId(shipmentId: string) {
    const shipmentAttachments = this.items.filter(
      (item) => item.shipmentId.toString() === shipmentId,
    )
    return shipmentAttachments
  }

  async createMany(attachments: ShipmentAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: ShipmentAttachment[]) {
    const shipmentAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = shipmentAttachments
  }
}
