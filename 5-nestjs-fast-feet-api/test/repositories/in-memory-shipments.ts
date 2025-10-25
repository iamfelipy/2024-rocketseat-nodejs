import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { InMemoryRecipientsRepository } from './in-memory-recipients'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { InMemoryShipmentAttachmentsRepository } from './in-memory-shipment-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryShipmentsRepository implements ShipmentsRepository {
  public items: Shipment[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
    private inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository,
  ) {}

  async findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    { page }: PaginationParams,
  ) {
    const MAX_DISTANCE_IN_KILOMETERS = maxDistanceInKm

    let filteredShipments: Shipment[] = []

    for (const item of this.items) {
      const recipient = await this.inMemoryRecipientsRepository.findById(
        item.recipientId.toString(),
      )

      if (!recipient) {
        throw new Error('Recipient not found')
      }

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
        item.courierId?.toString() === courierId &&
        item.statusShipment === ShipmentStatus.PICKED_UP
      ) {
        filteredShipments.push(item)
      }
    }

    filteredShipments = filteredShipments.slice((page - 1) * 20, page * 20)

    return filteredShipments
  }

  async findMany({ page }: PaginationParams): Promise<Shipment[]> {
    const shipments = this.items.slice((page - 1) * 20, page * 20)

    return shipments
  }

  async findAssignedShipmentForCourier(courierId: string, shipmentId: string) {
    const shipment = this.items.find(
      (item) =>
        item.courierId?.toString() === courierId &&
        item.id.toString() === shipmentId,
    )
    if (!shipment) {
      return null
    }

    return shipment
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
