import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaShipmentsRepository implements ShipmentsRepository {
  findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<Shipment[]> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Shipment | null> {
    throw new Error('Method not implemented.')
  }

  findMany(params: PaginationParams): Promise<Shipment[]> {
    throw new Error('Method not implemented.')
  }

  create(shipment: Shipment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(shipment: Shipment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(shipment: Shipment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findAssignedShipmentForCourier(
    courierId: string,
    shipmentId: string,
  ): Promise<Shipment | null> {
    throw new Error('Method not implemented.')
  }
}
