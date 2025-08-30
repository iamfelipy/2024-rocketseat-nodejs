import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { Courier } from "../../enterprise/entities/courier";
import { UserRole } from "@/core/enums/enum-user-role";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { AdminsRepository } from "../repositories/admins-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/errors/not-allowed-error";
import { Location } from "../../enterprise/entities/value-objects/location";

interface EditCourierByCourierUseCaseRequest {
  courierId: string
  cpf: string
  password: string
  roles: string[]
  name: string
  address: string
  latitude: number
  longitude: number
}
type EditCourierByCourierUseCaseResponse = Either<NotAuthorizedError | NotAllowedError,  
  {courier: Courier} 
>

export class EditCourierByCourierUseCase {
  constructor(private couriersRepository: CouriersRepository, private adminsRepository: AdminsRepository){}

  async execute({
    courierId,
    cpf,
    password,
    roles,
    name,
    address,
    latitude,
    longitude,
  }:EditCourierByCourierUseCaseRequest): Promise<EditCourierByCourierUseCaseResponse> {

    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    if(!Courier.areRolesValid(roles)) {
      return left(new NotAllowedError())
    }

    courier.password = password
    courier.cpf = cpf
    courier.roles = roles as UserRole[]
    courier.name = name
    courier.location = Location.create({
      address,
      latitude,
      longitude,
    })

    await this.couriersRepository.save(courier)

    return right({
      courier
    })
    
  }
}