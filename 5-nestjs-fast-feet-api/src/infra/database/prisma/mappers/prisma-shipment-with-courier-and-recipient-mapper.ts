import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { ShipmentWithCourierAndRecipient } from '@/domain/core/enterprise/entities/value-objects/shipment-with-courier-recipient'
import { Shipment as PrismaShipment, User as PrismaUSer } from '@prisma/client'

type PrismaShipmentWithCourierAndRecipient = PrismaShipment & {
  courier?: PrismaUSer | null
  recipient: PrismaUSer
}

export class PrismaShipmentWithCourierAndRecipientMapper {
  static toDomain(
    raw: PrismaShipmentWithCourierAndRecipient,
  ): ShipmentWithCourierAndRecipient {
    return ShipmentWithCourierAndRecipient.create({
      id: new UniqueEntityID(raw.id),
      statusShipment: raw.status as ShipmentStatus,
      recipientId: new UniqueEntityID(raw.recipientId),
      recipientName: raw.recipient.name,
      recipientAddress: raw.recipient.address,
      recipientLatitude: raw.recipient.latitude.toString(),
      recipientLongitude: raw.recipient.longitude.toString(),
      courierId: new UniqueEntityID(raw?.courierId ?? ''),
      courierName: raw?.courier?.name,
      pickupDate: raw.pickupDate,
      deliveryDate: raw.deliveryDate,
      returnedDate: raw.returnedDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
