import { Either, left, right } from '@/core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { CouriersRepository } from '../repositories/courier-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { Injectable } from '@nestjs/common'

interface ChangeCourierPasswordUseCaseRequest {
  adminId: string
  courierId: string
  newPassword: string
}
type ChangeCourierPasswordUseCaseResponse = Either<NotAuthorizedError, null>

@Injectable()
export class ChangeCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    courierId,
    newPassword,
  }: ChangeCourierPasswordUseCaseRequest): Promise<ChangeCourierPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    courier.password = hashedPassword

    await this.couriersRepository.save(courier)

    return right(null)
  }
}
