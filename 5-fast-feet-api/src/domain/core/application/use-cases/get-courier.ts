import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { Courier } from "../../enterprise/entities/courier";

interface GetCourierByIdUseCaseRequest {
  courierId: string
}
type GetCourierByIdUseCaseResponse = Either<ResourceNotFoundError, {
  courier: Courier
}>

export class GetCourierByIdUseCase {
  constructor(private couriersRepository: CouriersRepository) {}
  async execute({
    courierId
  }: GetCourierByIdUseCaseRequest): Promise<GetCourierByIdUseCaseResponse>  {
    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    return right({
      courier
    })
  }
}