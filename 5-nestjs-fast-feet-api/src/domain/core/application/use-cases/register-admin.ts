import { Either, left, right } from '@/core/either'
import { AdminAlreadyExistsError } from './erros/admin-already-exists-error'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Location } from '../../enterprise/entities/value-objects/location'
import { Injectable } from '@nestjs/common'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
  address: string
  latitude: number
  longitude: number
}
type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    address,
    latitude,
    longitude,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminsRepository.findByCPF(cpf)

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf,
      password: hashedPassword,
      location: Location.create({
        address,
        latitude,
        longitude,
      }),
    })

    await this.adminsRepository.create(admin)

    return right({
      admin,
    })
  }
}
