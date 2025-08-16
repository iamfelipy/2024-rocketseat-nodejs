import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { Recipient } from "../../enterprise/entities/recipient";
import { Location } from "../../enterprise/entities/value-objects/location";
import { RecipientAlreadyExistsError } from "./erros/recipient-already-exists-error";
import { HashGenerator } from "../cryptography/hash-generator";

interface RegisterRecipientUsecaseRequest {
  name: string
  cpf: string
  password: string
  address: string
  latitude: number
  longitude: number
}
type RegisterRecipientUsecaseResponse = Either<RecipientAlreadyExistsError, {
  recipient: Recipient
}>

export class RegisterRecipientUsecase {
  constructor(private recipientRepository: RecipientsRepository, private hashGenerator: HashGenerator){}
  async execute({
    name,
    cpf,
    password,
    address,
    latitude,
    longitude,
  }:RegisterRecipientUsecaseRequest): Promise<RegisterRecipientUsecaseResponse>{
    const recipientWithSameCpf = await this.recipientRepository.findByCPF(cpf)

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

    await this.recipientRepository.create(recipient)

    return right({
      recipient
    })
  }
}