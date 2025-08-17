import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { CourierAlreadyExistsError } from "./erros/courier-already-exists-error";
import { Courier } from "../../enterprise/entities/courier";
import { Location } from "../../enterprise/entities/value-objects/location";
import { HashGenerator } from "../cryptography/hash-generator";
import { AdminsRepository } from "../repositories/admins-repository";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";

interface RegisterCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
  address: string
  latitude: number
  longitude: number
  adminId: string
}
type RegisterCourierUseCaseResponse = Either<CourierAlreadyExistsError, {
  courier: Courier
}>

export class RegisterCourierUseCase {
  constructor(private couriersRepository: CouriersRepository,private adminsRepository: AdminsRepository, private hashGenerator: HashGenerator) {}
  async execute({
    name,
    cpf,
    password,
    address,
    latitude,
    longitude,
    adminId
  }:RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    
    if (!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }

    const courierWithSameCpf = await this.couriersRepository.findByCPF(cpf)

    if(courierWithSameCpf) {
      return left(new CourierAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      name,
      cpf,
      password: hashedPassword,
      location: Location.create({
        address,
        latitude,
        longitude,
      })
    })

    await this.couriersRepository.create(courier)

    return right({
      courier
    })
  }
}