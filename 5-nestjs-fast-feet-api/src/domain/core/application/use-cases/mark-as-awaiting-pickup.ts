import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Shipment } from '../../enterprise/entities/shipment'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Injectable } from '@nestjs/common'

interface MarkAsAwaitingPickupUseCaseUseCaseRequest {
  adminId: string
  shipmentId: string
}
type MarkAsAwaitingPickupUseCaseUseCaseResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class MarkAsAwaitingPickupUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    shipmentId,
  }: MarkAsAwaitingPickupUseCaseUseCaseRequest): Promise<MarkAsAwaitingPickupUseCaseUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }
    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    shipment.statusShipment = ShipmentStatus.AWAITING_PICKUP

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment,
    })
  }
}
