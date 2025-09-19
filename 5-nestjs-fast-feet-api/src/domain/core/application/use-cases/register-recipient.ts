import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { Recipient } from "../../enterprise/entities/recipient";
import { Location } from "../../enterprise/entities/value-objects/location";
import { RecipientAlreadyExistsError } from "./erros/recipient-already-exists-error";
import { HashGenerator } from "../cryptography/hash-generator";
import { AdminsRepository } from "../repositories/admins-repository";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";

interface RegisterRecipientUseCaseRequest {
  name: string
  cpf: string
  password: string
  address: string
  latitude: number
  longitude: number
  adminId: string
}
type RegisterRecipientUseCaseResponse = Either<NotAuthorizedError | RecipientAlreadyExistsError, {
  recipient: Recipient
}>

export class RegisterRecipientUsecase {
  constructor(private recipientsRepository: RecipientsRepository,private adminsRepository: AdminsRepository, private hashGenerator: HashGenerator){}
  async execute({
    name,
    cpf,
    password,
    address,
    latitude,
    longitude,
    adminId
  }:RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse>{
    const admin = await this.adminsRepository.findById(adminId)
    
    if (!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }
    
    const recipientWithSameCpf = await this.recipientsRepository.findByCPF(cpf)

    if(recipientWithSameCpf) {
      return left(new RecipientAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const recipient = Recipient.create({
      name,
      cpf,
      password: hashedPassword,
      location: Location.create({
        address,
        latitude,
        longitude
      })
    })

    await this.recipientsRepository.create(recipient)

    return right({
      recipient
    })
  }
}