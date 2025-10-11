import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { AdminsRepository } from '../repositories/admins-repository'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { Injectable } from '@nestjs/common'

interface EditRecipientProfileUseCaseRequest {
  recipientId: string
  name: string
  address: string
  latitude: number
  longitude: number
}
type EditRecipientProfileUseCaseResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientProfileUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    recipientId,
    name,
    address,
    latitude,
    longitude,
  }: EditRecipientProfileUseCaseRequest): Promise<EditRecipientProfileUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.location = Location.create({
      address,
      latitude,
      longitude,
    })

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
