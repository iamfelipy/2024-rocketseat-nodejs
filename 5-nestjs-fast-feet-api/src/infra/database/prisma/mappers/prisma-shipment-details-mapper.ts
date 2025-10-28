import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentDetails } from '@/domain/core/enterprise/entities/value-objects/shipment-details'
import {
  Shipment as PrismaShipment,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'
import { ShipmentStatus } from '@/core/enums/shipment-status'

type PrismaShipmentDetails = PrismaShipment & {
  recipient: PrismaUser
  courier: PrismaUser | null
  attachments: PrismaAttachment[]
}

export class PrismaShipmentDetailsMapper {
  static toDomain(raw: PrismaShipmentDetails): ShipmentDetails {
    return ShipmentDetails.create({
      shipmentId: new UniqueEntityID(raw.id),
      statusShipment: raw.status as ShipmentStatus,
      recipientId: new UniqueEntityID(raw.recipientId),
      recipientName: raw.recipient.name,
      courierId: raw?.courierId ? new UniqueEntityID(raw.courierId) : null,
      courierName: raw?.courier?.name,
      pickupDate: raw.pickupDate,
      deliveryDate: raw.deliveryDate,
      returnedDate: raw.returnedDate,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
