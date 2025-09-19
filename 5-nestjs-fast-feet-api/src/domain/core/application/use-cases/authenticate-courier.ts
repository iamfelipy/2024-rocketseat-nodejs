import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { WrongCredentialsError } from "./erros/wrong-credentials-error";
import { Courier } from "../../enterprise/entities/courier";
import { Encrypter } from "../cryptography/encrypter";

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}
type AuthenticateCourierUseCaseResponse =  Either<WrongCredentialsError,{
  accessToken: string
}>

export class AuthenticateCourierUseCase {
  constructor(private couriersRepository: CouriersRepository, private hashComparer:HashComparer, private encrypter: Encrypter) {}

  async execute({
    cpf,
    password
  }:AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCPF(cpf)

    if(!courier) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      courier.password
    )

    if(!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString()
    })

    return right({
      accessToken
    })
  }
}