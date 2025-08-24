import { Either, left, right } from "@/core/either";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { CouriersRepository } from "../repositories/courier-repository";
import { AdminsRepository } from "../repositories/admins-repository";

interface DeleteCourierUseCaseRequest {
  adminId: string
  courierId: string
}
type DeleteCourierUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, null>

export class  DeleteCourierUseCase {
  constructor(private couriersRepository: CouriersRepository, private adminsRepository: AdminsRepository) {}

  async execute(
    {
      adminId,
      courierId
    }: DeleteCourierUseCaseRequest
  ): Promise<DeleteCourierUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
 
    if(!admin) {
      return left(new NotAuthorizedError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right(null)
  }
}