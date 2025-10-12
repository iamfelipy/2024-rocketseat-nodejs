import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Courier } from '../../enterprise/entities/courier'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Injectable } from '@nestjs/common'

interface GetCourierUseCaseRequest {
  adminId: string
  courierId: string
}
type GetCourierUseCaseResponse = Either<
  ResourceNotFoundError | NotAuthorizedError,
  {
    courier: Courier
  }
>

@Injectable()
export class GetCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private adminsRespository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    courierId,
  }: GetCourierUseCaseRequest): Promise<GetCourierUseCaseResponse> {
    const admin = await this.adminsRespository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courier,
    })
  }
}
