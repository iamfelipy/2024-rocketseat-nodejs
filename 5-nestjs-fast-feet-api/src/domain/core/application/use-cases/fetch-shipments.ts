import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { ShipmentWithCourierAndRecipient } from '../../enterprise/entities/value-objects/shipment-with-courier-recipient'
import { Injectable } from '@nestjs/common'

interface FetchShipmentsUseCaseRequest {
  adminId: string
  page: number
}
type FetchShipmentsUseCaseResponse = Either<
  NotAuthorizedError,
  {
    shipments: ShipmentWithCourierAndRecipient[]
  }
>

@Injectable()
export class FetchShipmentsUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchShipmentsUseCaseRequest): Promise<FetchShipmentsUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const shipments =
      await this.shipmentsRepository.findManyWithCourierAndRecipient({ page })

    return right({
      shipments,
    })
  }
}
