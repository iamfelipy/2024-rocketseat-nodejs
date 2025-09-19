import { Either, left, right } from "@/core/either";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./erros/wrong-credentials-error";

interface AuthenticateRecipientUseCaseRequest {
  cpf: string
  password: string
}
type AuthenticateRecipientUseCaseResponse = Either<WrongCredentialsError, {
  accessToken: string
}>

export class AuthenticateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository, 
    private hashComparer: HashComparer, 
    private encrypter: Encrypter
  ) {}
  async execute({
    cpf,
    password
  }: AuthenticateRecipientUseCaseRequest): Promise<AuthenticateRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByCPF(cpf)
    if(!recipient) {
      return left(new WrongCredentialsError())
    }
    const isPasswordValid = await this.hashComparer.compare(
      password,
      recipient.password
    )
    if(!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id.toString()
    })

    return right({
      accessToken
    })
  }
}