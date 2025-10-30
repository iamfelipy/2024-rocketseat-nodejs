import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { InMemoryRecipientsRepository } from './in-memory-recipients'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { InMemoryShipmentAttachmentsRepository } from './in-memory-shipment-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { ShipmentWithCourierAndRecipient } from '@/domain/core/enterprise/entities/value-objects/shipment-with-recipient-and-courier'
import { InMemoryCouriersRepository } from './in-memory-couriers'
import { ShipmentDetails } from '@/domain/core/enterprise/entities/value-objects/shipment-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments'

export class InMemoryShipmentsRepository implements ShipmentsRepository {
  public items: Shipment[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
    private inMemoryCouriersRepositoty: InMemoryCouriersRepository,
    private inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository,
    private attachmentsRepositry: InMemoryAttachmentsRepository,
  ) {}

  async findManyWithCourierAndRecipient({
    page,
  }: PaginationParams): Promise<ShipmentWithCourierAndRecipient[]> {
    const shipments = this.items
      .slice((page - 1) * 20, page * 20)
      .map((shipment) => {
        const courier = this.inMemoryCouriersRepositoty.items.find(
          (courier) => courier.id.toString() === shipment.courierId?.toString(),
        )

        const recipient = this.inMemoryRecipientsRepository.items.find(
          (recipient) =>
            recipient.id.toString() === shipment.recipientId.toString(),
        )

        if (!recipient) {
          throw new Error(
            `Recipient with ID ${shipment.recipientId.toString()} does not exist`,
          )
        }

        return ShipmentWithCourierAndRecipient.create({
          id: shipment.id,
          statusShipment: shipment.statusShipment,
          pickupDate: shipment.pickupDate,
          deliveryDate: shipment.deliveryDate,
          returnedDate: shipment.returnedDate,
          recipientId: shipment.recipientId,
          recipientName: recipient.name,
          recipientAddress: recipient.location.address,
          recipientLatitude: recipient.location.latitude.toString(),
          recipientLongitude: recipient.location.longitude.toString(),
          courierId: shipment.courierId,
          courierName: courier?.name,
          createdAt: shipment.createdAt,
          updatedAt: shipment.updatedAt,
        })
      })

    return shipments
  }

  async findManyNearbyForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    { page }: PaginationParams,
  ) {
    const MAX_DISTANCE_IN_KILOMETERS = maxDistanceInKm

    let filteredShipments: ShipmentWithCourierAndRecipient[] = []

    for (const shipment of this.items) {
      const recipient = await this.inMemoryRecipientsRepository.findById(
        shipment.recipientId.toString(),
      )

      if (!recipient) {
        throw new Error('Recipient not found')
      }

      const courier = this.inMemoryCouriersRepositoty.items.find(
        (courier) => courier.id.toString() === shipment.courierId?.toString(),
      )

      const distance = getDistanceBetweenCoordinates(
        {
          latitude: courierLatitude,
          longitude: courierLongitude,
        },
        {
          latitude: recipient.location.latitude,
          longitude: recipient.location.longitude,
        },
      )

      if (
        distance <= MAX_DISTANCE_IN_KILOMETERS &&
        shipment.courierId?.toString() === courierId &&
        shipment.statusShipment === ShipmentStatus.PICKED_UP
      ) {
        filteredShipments.push(
          ShipmentWithCourierAndRecipient.create({
            id: shipment.id,
            statusShipment: shipment.statusShipment,
            pickupDate: shipment.pickupDate,
            deliveryDate: shipment.deliveryDate,
            returnedDate: shipment.returnedDate,
            recipientId: shipment.recipientId,
            recipientName: recipient.name,
            recipientAddress: recipient.location.address,
            recipientLatitude: recipient.location.latitude.toString(),
            recipientLongitude: recipient.location.longitude.toString(),
            courierId: shipment.courierId,
            courierName: courier?.name,
            createdAt: shipment.createdAt,
            updatedAt: shipment.updatedAt,
          }),
        )
      }
    }

    filteredShipments = filteredShipments.slice((page - 1) * 20, page * 20)

    return filteredShipments
  }

  async findManyOwn(userId, { page }: PaginationParams) {
    const shipments = this.items
      .filter(
        (item) =>
          item.courierId?.toString() === userId ||
          item.recipientId?.toString() === userId,
      )
      .slice((page - 1) * 20, page * 20)

    return shipments
  }

  async findMany({ page }: PaginationParams): Promise<Shipment[]> {
    const shipments = this.items.slice((page - 1) * 20, page * 20)

    return shipments
  }

  async findAssignedForCourier(courierId: string, shipmentId: string) {
    const shipment = this.items.find(
      (item) => item.id.toString() === shipmentId,
    )

    if (!shipment) {
      return null
    }

    const courier = this.inMemoryCouriersRepositoty.items.find(
      (courier) => courier.id.toString() === courierId?.toString(),
    )

    const recipient = this.inMemoryRecipientsRepository.items.find(
      (recipient) =>
        recipient.id.toString() === shipment.recipientId.toString(),
    )

    if (!recipient) {
      throw new Error(
        `Recipient with ID ${shipment.recipientId.toString()} does not exist`,
      )
    }

    const shipmentAttachments =
      this.inMemoryShipmentAttachmentsRepository.items.filter(
        (shipmentAttachment) =>
          shipmentAttachment.shipmentId.equals(shipment.id),
      )

    const attachments = shipmentAttachments.map((shipmentAttachment) => {
      const attachment = this.attachmentsRepositry.items.find((attachment) =>
        attachment.id.equals(shipmentAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${shipmentAttachment.attachmentId.toString()} does not exist.`,
        )
      }

      return attachment
    })

    return ShipmentDetails.create({
      shipmentId: shipment.id,
      statusShipment: shipment.statusShipment,
      pickupDate: shipment.pickupDate,
      deliveryDate: shipment.deliveryDate,
      returnedDate: shipment.returnedDate,
      recipientId: shipment.recipientId,
      recipientName: recipient.name,
      courierId: shipment.courierId,
      courierName: courier?.name,
      attachments,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    })
  }

  async create(shipment: Shipment) {
    this.items.push(shipment)
  }

  async findById(id: string) {
    const shipment = this.items.find((item) => item.id.toString() === id)

    if (!shipment) {
      return null
    }

    return shipment
  }

  async findDetailsById(id: string) {
    const shipment = this.items.find((item) => item.id.toString() === id)

    if (!shipment) {
      return null
    }

    const courier = this.inMemoryCouriersRepositoty.items.find(
      (courier) => courier.id.toString() === shipment.courierId?.toString(),
    )

    const recipient = this.inMemoryRecipientsRepository.items.find(
      (recipient) =>
        recipient.id.toString() === shipment.recipientId.toString(),
    )

    if (!recipient) {
      throw new Error(
        `Recipient with ID ${shipment.recipientId.toString()} does not exist`,
      )
    }

    const shipmentAttachments =
      this.inMemoryShipmentAttachmentsRepository.items.filter(
        (shipmentAttachment) =>
          shipmentAttachment.shipmentId.equals(shipment.id),
      )

    const attachments = shipmentAttachments.map((shipmentAttachment) => {
      const attachment = this.attachmentsRepositry.items.find((attachment) =>
        attachment.id.equals(shipmentAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${shipmentAttachment.attachmentId.toString()} does not exist.`,
        )
      }

      return attachment
    })

    return ShipmentDetails.create({
      shipmentId: shipment.id,
      statusShipment: shipment.statusShipment,
      pickupDate: shipment.pickupDate,
      deliveryDate: shipment.deliveryDate,
      returnedDate: shipment.returnedDate,
      recipientId: shipment.recipientId,
      recipientName: recipient.name,
      courierId: shipment.courierId,
      courierName: courier?.name,
      attachments,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    })
  }

  async delete(shipment: Shipment) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === shipment.id.toString(),
    )

    this.items.splice(index, 1)

    await this.inMemoryShipmentAttachmentsRepository.deleteManyByShipmentId(
      shipment.id.toString(),
    )
  }

  async save(shipment: Shipment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === shipment.id.toString(),
    )

    this.items[itemIndex] = shipment

    await this.inMemoryShipmentAttachmentsRepository.createMany(
      shipment.attachments.getNewItems(),
    )
    await this.inMemoryShipmentAttachmentsRepository.deleteMany(
      shipment.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(shipment.id)
  }
}
