import { Either, left, right } from "@/core/either";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { AdminsRepository } from "../repositories/admins-repository";

interface FetchRecipientsUseCaseRequest {
  adminId: string
  page: number
}
type FetchRecipientsUseCaseResponse = Either<NotAuthorizedError, {
  recipients: Recipient[]
}>
export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository, private adminsRepository: AdminsRepository) {}
  async execute({
    adminId,
    page
  }:FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError())
    }
    const recipients = await this.recipientsRepository.findMany({page})

    return right({
      recipients
    })
  }
}