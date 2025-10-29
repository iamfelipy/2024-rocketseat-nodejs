import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ShipmentDetails } from '../../enterprise/entities/value-objects/shipment-details'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { Injectable } from '@nestjs/common'

interface GetShipmentForCourierUseCaseRequest {
  courierId: string
  shipmentId: string
}
type GetShipmentForCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    shipment: ShipmentDetails
  }
>

@Injectable()
export class GetShipmentForCourierUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private couriersRepository: CouriersRepository,
  ) {}

  async execute({
    courierId,
    shipmentId,
  }: GetShipmentForCourierUseCaseRequest): Promise<GetShipmentForCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const shipment = await this.shipmentsRepository.findAssignedForCourier(
      courierId,
      shipmentId,
    )
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    if (!shipment.courierId?.equals(courier.id)) {
      return left(new NotAuthorizedError())
    }

    return right({
      shipment,
    })
  }
}
