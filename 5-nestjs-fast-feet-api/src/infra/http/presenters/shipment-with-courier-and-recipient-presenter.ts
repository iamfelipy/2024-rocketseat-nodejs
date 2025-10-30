import { ShipmentWithCourierAndRecipient } from '@/domain/core/enterprise/entities/value-objects/shipment-with-recipient-and-courier'

export class ShipmentWithCourierAndRecipientPresenter {
  static toHTTP(
    shipmentWithCourierAndRecipient: ShipmentWithCourierAndRecipient,
  ) {
    return {
      id: shipmentWithCourierAndRecipient.id.toString(),
      statusShipment: shipmentWithCourierAndRecipient.statusShipment,
      pickupDate: shipmentWithCourierAndRecipient.pickupDate?.toISOString(),
      deliveryDate: shipmentWithCourierAndRecipient.deliveryDate?.toISOString(),
      returnedDate: shipmentWithCourierAndRecipient.returnedDate?.toISOString(),
      recipientId: shipmentWithCourierAndRecipient.recipientId.toString(),
      recipientName: shipmentWithCourierAndRecipient.recipientName,
      recipientAddress: shipmentWithCourierAndRecipient.recipientAddress,
      recipientLatitude: shipmentWithCourierAndRecipient.recipientLatitude,
      recipientLongitude: shipmentWithCourierAndRecipient.recipientLongitude,
      courierId: shipmentWithCourierAndRecipient?.courierId?.toString(),
      courierName: shipmentWithCourierAndRecipient.courier,
      createdAt: shipmentWithCourierAndRecipient.createdAt.toISOString(),
      updatedAt: shipmentWithCourierAndRecipient.updatedAt?.toISOString(),
    }
  }
}
