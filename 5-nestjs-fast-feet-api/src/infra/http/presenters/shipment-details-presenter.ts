import { ShipmentDetails } from '@/domain/core/enterprise/entities/value-objects/shipment-details'
import { AttachmentPresenter } from './attachment-presenter'

export class ShipmentDetailsPresenter {
  static toHTTP(shipmentDetails: ShipmentDetails) {
    return {
      shipmentId: shipmentDetails.shipmentId.toString(),
      statusShipment: shipmentDetails.statusShipment,
      pickupDate: shipmentDetails.pickupDate?.toISOString(),
      deliveryDate: shipmentDetails.deliveryDate?.toISOString(),
      returnedDate: shipmentDetails.returnedDate?.toISOString(),
      recipientId: shipmentDetails.recipientId.toString(),
      recipientName: shipmentDetails.recipient,
      courierId: shipmentDetails.courierId?.toString(),
      courierName: shipmentDetails.courier,
      attachments: shipmentDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: shipmentDetails.createdAt.toISOString(),
      updatedAt: shipmentDetails.updatedAt?.toISOString(),
    }
  }
}
