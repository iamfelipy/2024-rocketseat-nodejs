import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Shipment } from '../../enterprise/entities/shipment'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { CouriersRepository } from '../repositories/courier-repository'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Injectable } from '@nestjs/common'

interface MarkShipmentAsPickedUpUseCaseRequest {
  adminId: string
  courierId: string
  shipmentId: string
}
type MarkShipmentAsPickedUpUseCaseResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class MarkShipmentAsPickedUpUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    courierId,
    shipmentId,
  }: MarkShipmentAsPickedUpUseCaseRequest): Promise<MarkShipmentAsPickedUpUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }
    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    shipment.courierId = courier.id
    shipment.statusShipment = ShipmentStatus.PICKED_UP
    shipment.pickupDate = new Date()

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment,
    })
  }
}
