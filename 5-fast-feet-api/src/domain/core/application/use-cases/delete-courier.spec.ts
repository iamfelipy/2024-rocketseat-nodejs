import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins"
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { DeleteCourierUseCase } from "./delete-courier"
import { makeAdmin } from "test/factories/make-admin"
import { makeCourier } from "test/factories/make-courier"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteCourierUseCase

describe('Delete Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository, inMemoryAdminsRepository)
  })
  it('should be able to delete a courier', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)

    const courier = makeCourier()
    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: courier.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
  it('should not allow deleting a courier if user is not admin', async () => {
    const courier = makeCourier()
    await inMemoryCouriersRepository.create(courier)

    // use a non-existent adminId
    const nonAdminId = "non-existent-admin-id"

    const result = await sut.execute({
      adminId: nonAdminId,
      courierId: courier.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  
})