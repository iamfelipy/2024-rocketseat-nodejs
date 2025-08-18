import { PaginationParams } from '@/core/repositories/pagination-params'
import { Shipment } from '../../enterprise/entities/shipment'

export interface ShipmentsRepository {
  findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<Shipment[]>
  create(shipment: Shipment): Promise<void>
}
