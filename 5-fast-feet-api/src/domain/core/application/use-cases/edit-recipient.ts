import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { Recipient } from "../../enterprise/entities/recipient";
import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { AdminsRepository } from "../repositories/admins-repository";
import { UserRole } from "@/core/enums/enum-user-role";
import {Location} from '@/domain/core/enterprise/entities/value-objects/location'

interface RecipientUseCaseRequest {
  recipientId: string
  cpf: string
  password: string
  roles: string[]
  name: string
  address: string
  latitude: number
  longitude: number
  adminId: string
}
type RecipientUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, {
  recipient: Recipient
}>

export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository, private adminsRepository: AdminsRepository){}
  async execute({
    adminId,
    recipientId,
    cpf,
    password,
    roles,
    name,
    address,
    latitude,
    longitude,
  }:RecipientUseCaseRequest): Promise<RecipientUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)
    if(!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.cpf = cpf
    recipient.password = password
    recipient.roles = roles as UserRole[]
    recipient.name = name
    recipient.location = Location.create({
      address,
      latitude,
      longitude,
    })

    await this.recipientsRepository.save(recipient)

    return right({
      recipient
    })

  }
}