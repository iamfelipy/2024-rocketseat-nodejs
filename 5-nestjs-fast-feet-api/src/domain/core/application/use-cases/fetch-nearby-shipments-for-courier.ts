import { Either, right } from '@/core/either'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { Injectable } from '@nestjs/common'
import { ShipmentWithCourierAndRecipient } from '../../enterprise/entities/value-objects/shipment-with-courier-recipient'

interface FetchNearbyShipmentsForCourierUseCaseRequest {
  courierId: string
  maxDistanceInKm: number
  courierLatitude: number
  courierLongitude: number
  page: number
}
type FetchNearbyShipmentsForCourierUseCaseResponse = Either<
  null,
  {
    shipments: ShipmentWithCourierAndRecipient[]
  }
>

@Injectable()
export class FetchNearbyShipmentsForCourierUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository) {}

  async execute({
    courierId,
    maxDistanceInKm,
    courierLatitude,
    courierLongitude,
    page,
  }: FetchNearbyShipmentsForCourierUseCaseRequest): Promise<FetchNearbyShipmentsForCourierUseCaseResponse> {
    const shipments = await this.shipmentsRepository.findManyNearbyForCourier(
      courierId,
      maxDistanceInKm,
      courierLatitude,
      courierLongitude,
      { page },
    )

    return right({
      shipments,
    })
  }
}
