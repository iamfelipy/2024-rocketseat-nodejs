import { PaginationParams } from '@/core/repositories/pagination-params'
import { Shipment } from '../../enterprise/entities/shipment'

export abstract class ShipmentsRepository {
  abstract findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<Shipment[]>

  abstract findById(id: string): Promise<Shipment | null>
  abstract findMany(params: PaginationParams): Promise<Shipment[]>
  abstract create(shipment: Shipment): Promise<void>
  abstract save(shipment: Shipment): Promise<void>
  abstract delete(shipment: Shipment): Promise<void>
  abstract findAssignedShipmentForCourier(
    courierId: string,
    shipmentId: string,
  ): Promise<Shipment | null>
}
