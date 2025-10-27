import { PaginationParams } from '@/core/repositories/pagination-params'
import { Shipment } from '../../enterprise/entities/shipment'
import { ShipmentWithCourierAndRecipient } from '../../enterprise/entities/value-objects/shipment-with-recipient-and-courier'

export abstract class ShipmentsRepository {
  abstract findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<Shipment[]>

  abstract findManyWithCourierAndRecipient(
    params: PaginationParams,
  ): Promise<ShipmentWithCourierAndRecipient[]>


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
