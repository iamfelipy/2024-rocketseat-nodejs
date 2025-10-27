import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { Shipment } from '../../enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'

interface FetchOwnShipmentsUseCaseRequest {
  userId: string
  page: number
}
type FetchOwnShipmentsUseCaseResponse = Either<
  NotAuthorizedError,
  {
    shipments: Shipment[]
  }
>

@Injectable()
export class FetchOwnShipmentsUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository) {}

  async execute({
    userId,
    page,
  }: FetchOwnShipmentsUseCaseRequest): Promise<FetchOwnShipmentsUseCaseResponse> {
    const shipments = await this.shipmentsRepository.findManyOwn(userId, {
      page,
    })

    return right({
      shipments,
    })
  }
}
