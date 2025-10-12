import { Either, left, right } from '@/core/either'
import { Shipment } from '../../enterprise/entities/shipment'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CreateShipmentUseCaseRequest {
  recipientId: string
  adminId: string
}
type CreateShipmentUseCaseResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    recipientId,
    adminId,
  }: CreateShipmentUseCaseRequest): Promise<CreateShipmentUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const shipment = Shipment.create({
      recipientId: recipient.id,
    })

    await this.shipmentsRepository.create(shipment)

    return right({
      shipment,
    })
  }
}
