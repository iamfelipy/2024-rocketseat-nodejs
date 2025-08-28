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
  findById(id: string): Promise<Shipment | null>
  findMany(params: PaginationParams): Promise<Shipment[]>
  create(shipment: Shipment): Promise<void>
  save(shipment: Shipment): Promise<void>
  delete(shipment: Shipment): Promise<void>
  findAssignedShipmentForCourier(courierId: string,shipmentId: string): Promise<Shipment | null>
}
