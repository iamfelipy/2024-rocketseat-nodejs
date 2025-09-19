import { Either, left, right } from "@/core/either";
import { AdminsRepository } from "../repositories/admins-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./erros/wrong-credentials-error";

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}
type AuthenticateAdminUseCaseResponse = Either<WrongCredentialsError,{
  accessToken: string
}>

export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository, 
    private hashComparer: HashComparer, 
    private encrypter: Encrypter
  ) {}
  async execute({
    cpf,
    password
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByCPF(cpf)
    if(!admin) {
      return left(new WrongCredentialsError())
    }
    const isPasswordValid = await this.hashComparer.compare(password, admin.password)
    if(!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString()
    })

    return right({
      accessToken
    })
  }
}