import { Shipment } from '@/domain/core/enterprise/entities/shipment'

export class ShipmentPresenter {
  static toHTTP(shipment: Shipment) {
    return {
      id: shipment.id.toString(),
      statusShipment: shipment.statusShipment,
      recipientId: shipment.recipientId.toString(),
      pickupDate: shipment.pickupDate,
      deliveryDate: shipment.deliveryDate,
      returnedDate: shipment.returnedDate,
      // revisar se faz sentido trazer, por causa de overfetching
      // attachments: shipment.attachments,
      courierId: shipment.courierId?.toString(),
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    }
  }
}
