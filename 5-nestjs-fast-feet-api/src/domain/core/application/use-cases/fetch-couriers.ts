import { Either, left, right } from "@/core/either";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { Courier } from "../../enterprise/entities/courier";
import { CouriersRepository } from "../repositories/courier-repository";
import { AdminsRepository } from "../repositories/admins-repository";

interface FetchCouriersUseCaseRequest {
  adminId: string
  page: number
}
type FetchCouriersUseCaseResponse = Either<NotAuthorizedError, {
  couriers: Courier[]
}>

export class FetchCouriersUseCase {
  constructor(private couriersRepository: CouriersRepository, private adminsRepository: AdminsRepository){}
  async execute({
    adminId,
    page,
  }:FetchCouriersUseCaseRequest): Promise<FetchCouriersUseCaseResponse>{
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError())
    }

    const couriers = await this.couriersRepository.findMany({page})

    return right({
      couriers
    })
  }
}