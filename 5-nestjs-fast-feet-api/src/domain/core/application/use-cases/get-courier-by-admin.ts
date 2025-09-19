import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { Courier } from "../../enterprise/entities/courier";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { AdminsRepository } from "../repositories/admins-repository";

interface GetCourierByAdminUseCaseRequest {
  adminId: string
  courierId: string
}
type GetCourierByAdminUseCaseResponse = Either<ResourceNotFoundError | NotAuthorizedError, {
  courier: Courier
}>

export class GetCourierByAdminUseCase {
  constructor(private couriersRepository: CouriersRepository, private adminsRespository: AdminsRepository) {}
  async execute({
    adminId,
    courierId
  }: GetCourierByAdminUseCaseRequest): Promise<GetCourierByAdminUseCaseResponse>  {
    const admin = await this.adminsRespository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError())
    }
    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courier
    })
  }
}