import { Either, right } from '@/core/either'
import { Shipment } from '../../enterprise/entities/shipment'
import { ShipmentsRepository } from '../repositories/shipments-repository'

interface FetchNearbyAssignedShipmentsForCourierUseCaseRequest {
  courierId: string
  maxDistanceInKm: number
  courierLatitude: number
  courierLongitude: number
  page: number
}
type FetchNearbyAssignedShipmentsForCourierUseCaseResponse = Either<null, {
  shipments: Shipment[]
}>

export class FetchNearbyAssignedShipmentsForCourierUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository) {}

  async execute({
    courierId,
    maxDistanceInKm,
    courierLatitude,
    courierLongitude,
    page
  }: FetchNearbyAssignedShipmentsForCourierUseCaseRequest): Promise<FetchNearbyAssignedShipmentsForCourierUseCaseResponse> {    
    const shipments =
      await this.shipmentsRepository.findManyNearbyAssignedShipmentsForCourier(
        courierId,
        maxDistanceInKm,
        courierLatitude,
        courierLongitude,
        { page }
      )

    return right({
      shipments,
    })
  }
} 
 