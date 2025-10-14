import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteShipmentUseCaseRequest {
  shipmentId: string
  adminId: string
}
type DeleteShipmentUseCaseResponse = Either<
  ResourceNotFoundError | NotAuthorizedError,
  null
>

@Injectable()
export class DeleteShipmentUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    shipmentId,
    adminId,
  }: DeleteShipmentUseCaseRequest): Promise<DeleteShipmentUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)

    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    await this.shipmentsRepository.delete(shipment)

    return right(null)
  }
}
