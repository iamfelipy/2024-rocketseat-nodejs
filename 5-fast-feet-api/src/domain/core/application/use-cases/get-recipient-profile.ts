import { NotAllowedError } from "@/core/erros/errors/not-allowed-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";

interface GetRecipientProfileUseCaseRequest {
  recipientId: string
}
type GetRecipientProfileUseCaseResponse = Either<NotAllowedError, {
  recipient: Recipient
}>

export class GetRecipientProfileUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}
  async execute({
    recipientId
  }:GetRecipientProfileUseCaseRequest): Promise<GetRecipientProfileUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient || !recipient.isRecipient()) {
      return left(new NotAllowedError())
    }

    return right({
      recipient
    })
  }
}