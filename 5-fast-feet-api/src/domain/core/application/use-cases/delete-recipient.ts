import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { AdminsRepository } from "../repositories/admins-repository";
import { Either, left, right } from "@/core/either";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";

interface DeleteRecipientUseCaseRequest {
  recipientId: string
  adminId: string
}
type DeleteRecipientUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, null>

export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository, private adminsRepository: AdminsRepository){}
  async execute({
    recipientId,
    adminId
  }:DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse>{
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)
    if(!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
