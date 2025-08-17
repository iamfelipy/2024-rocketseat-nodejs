import {
  ShipmentsRepository,
} from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { InMemoryRecipientsRepository } from './in-memory-recipients'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryShipmentsRepository implements ShipmentsRepository {
  public items: Shipment[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findManyNearbyShipmentsForCourier(
    courierLatitude: number,
    courierLongitude: number,
    {page}: PaginationParams,
  ) {

    const MAX_DISTANCE_IN_KILOMETERS = 10

    const nearbyShipments: Shipment[] = []

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

      if (distance < MAX_DISTANCE_IN_KILOMETERS) {
        nearbyShipments.push(item)
      }
    }
    
    const offset = (page - 1)  * 20
    const limit = page * 20

    const nearbyShipmentsPaginated = nearbyShipments.slice(offset, limit)

    return nearbyShipmentsPaginated
  }

  async create(shipment: Shipment) {
    this.items.push(shipment)
  }
}
