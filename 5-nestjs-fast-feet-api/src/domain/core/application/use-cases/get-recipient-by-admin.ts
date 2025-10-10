import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetRecipientByAdminUseCaseRequest {
  recipientId: string
  adminId: string
}
type GetRecipientByAdminUseCaseResponse = Either<
  NotAuthorizedError | NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientByAdminUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    recipientId,
    adminId,
  }: GetRecipientByAdminUseCaseRequest): Promise<GetRecipientByAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
