import { PaginationParams } from '@/core/repositories/pagination-params'
import { Shipment } from '../../enterprise/entities/shipment'
import { ShipmentWithCourierAndRecipient } from '../../enterprise/entities/value-objects/shipment-with-recipient-and-courier'
import { ShipmentDetails } from '../../enterprise/entities/value-objects/shipment-details'

export abstract class ShipmentsRepository {
  abstract findManyNearbyForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<ShipmentWithCourierAndRecipient[]>

  abstract findManyWithCourierAndRecipient(
    params: PaginationParams,
  ): Promise<ShipmentWithCourierAndRecipient[]>

  abstract findManyOwn(
    userId: string,
    params: PaginationParams,
  ): Promise<Shipment[]>

  abstract findById(id: string): Promise<Shipment | null>
  abstract findDetailsById(id: string): Promise<ShipmentDetails | null>
  abstract findMany(params: PaginationParams): Promise<Shipment[]>
  abstract create(shipment: Shipment): Promise<void>
  abstract save(shipment: Shipment): Promise<void>
  abstract delete(shipment: Shipment): Promise<void>
  abstract findAssignedForCourier(
    courierId: string,
    shipmentId: string,
  ): Promise<ShipmentDetails | null>
}
