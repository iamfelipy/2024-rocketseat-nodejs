import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { Courier } from "../../enterprise/entities/courier";
import { UserRole } from "@/core/enums/enum-user-role";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { AdminsRepository } from "../repositories/admins-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/errors/not-allowed-error";
import { Location } from "../../enterprise/entities/value-objects/location";

interface EditCourierByAdminUseCaseRequest {
  courierId: string
  cpf: string
  password: string
  roles: string[]
  name: string
  address: string
  latitude: number
  longitude: number
  adminId: string
}
type EditCourierByAdminUseCaseResponse = Either<NotAuthorizedError | NotAllowedError,  
  {courier: Courier} 
>

export class EditCourierByAdminUseCase {
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
    adminId,
  }:EditCourierByAdminUseCaseRequest): Promise<EditCourierByAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    
    if (!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }

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