import { Either, left, right } from "@/core/either";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers";

interface DeleteCourierUseCaseRequest {
  adminId: string
  courierId: string
}
type DeleteCourierUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, null>

export class  DeleteCourierUseCase {
  constructor(private inMemoryCouriersRepository: InMemoryCouriersRepository, private inMemoryAdminsRepository: InMemoryAdminsRepository) {}

  async execute(
    {
      adminId,
      courierId
    }: DeleteCourierUseCaseRequest
  ): Promise<DeleteCourierUseCaseResponse> {
    const admin = await this.inMemoryAdminsRepository.findById(adminId)
 
    if(!admin) {
      return left(new NotAuthorizedError())
    }

    const courier = await this.inMemoryCouriersRepository.findById(courierId)

    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.inMemoryCouriersRepository.delete(courier)

    return right(null)
  }
}