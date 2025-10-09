import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { Prisma, Shipment as ShipmentPrisma } from '@prisma/client'

export class PrismaShipmentMapper {
  static toDomain(raw: ShipmentPrisma): Shipment {
    return Shipment.create(
      {
        statusShipment: raw.status as ShipmentStatus,
        recipientId: new UniqueEntityID(raw.recipientId),
        courierId: raw.courierId ? new UniqueEntityID(raw.courierId) : null,
        pickupDate: raw.pickupDate,
        deliveryDate: raw.deliveryDate,
        returnedDate: raw.returnedDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(shipment: Shipment): Prisma.ShipmentUncheckedCreateInput {
    return {
      id: shipment.id.toString(),
      status: shipment.statusShipment,
      recipientId: shipment.recipientId.toString(),
      courierId: shipment.courierId?.toString() || null,
      pickupDate: shipment.pickupDate,
      deliveryDate: shipment.deliveryDate,
      returnedDate: shipment.returnedDate,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    }
  }
}
