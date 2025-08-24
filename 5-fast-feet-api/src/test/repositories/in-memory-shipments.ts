import {
  ShipmentsRepository,
} from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { InMemoryRecipientsRepository } from './in-memory-recipients'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentStatus } from '@/core/enums/shipment-status'

export class InMemoryShipmentsRepository implements ShipmentsRepository {
  public items: Shipment[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    {page}: PaginationParams,
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
        item.assignedCourierId?.toString() === courierId &&
        item.statusShipment === ShipmentStatus.PICKED_UP
      ) {
        filteredShipments.push(item)
      }
    }

    filteredShipments = filteredShipments.slice((page - 1)  * 20, page * 20)

    return filteredShipments
  }

  async create(shipment: Shipment) {
    this.items.push(shipment)
  }

  async findById(id: string) {
    const shipment = this.items.find(item => item.id.toString() === id)

    if(!shipment) {
      return null
    }

    return shipment
  }

  async delete(shipment: Shipment) {
    const index = this.items.findIndex(item => item.id.toString() === shipment.id.toString())

    this.items.splice(index, 1)
  }
}
 