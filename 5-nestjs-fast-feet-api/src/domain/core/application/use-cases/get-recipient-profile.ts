import { Recipient } from '../../enterprise/entities/recipient'
import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'

interface GetRecipientProfileUseCaseRequest {
  recipientId: string
}
type GetRecipientProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientProfileUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}
  async execute({
    recipientId,
  }: GetRecipientProfileUseCaseRequest): Promise<GetRecipientProfileUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    if (!recipient.isRecipient()) {
      return left(new NotAllowedError())
    }

    return right({
      recipient,
    })
  }
}
