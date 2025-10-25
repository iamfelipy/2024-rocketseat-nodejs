import { Either, left, right } from '@/core/either'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { Shipment } from '../../enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'

interface MarkShipmentAsReturnedRequest {
  shipmentId: string
  adminId: string
}
type MarkShipmentAsReturnedResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class MarkShipmentAsReturnedUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    shipmentId,
    adminId,
  }: MarkShipmentAsReturnedRequest): Promise<MarkShipmentAsReturnedResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    shipment.statusShipment = ShipmentStatus.RETURNED
    shipment.returnedDate = new Date()

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment,
    })
  }
}
