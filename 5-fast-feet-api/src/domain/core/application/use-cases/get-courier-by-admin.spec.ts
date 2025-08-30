import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { makeCourier } from "@/test/factories/make-courier"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { makeAdmin } from "@/test/factories/make-admin"
import { GetCourierByAdminUseCase } from "./get-courier-by-admin"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: GetCourierByAdminUseCase

describe('Get Courier', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new GetCourierByAdminUseCase(inMemoryCouriersRepository, inMemoryAdminsRepository)
  })
  it('should be able to get a courier by Id', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    
    const courier = makeCourier({name: 'john doe'}, new UniqueEntityID('courier-1'))
    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: 'courier-1'
    })
    
    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items).toHaveLength(1)
    expect(result.value).toMatchObject({
      courier: expect.objectContaining({
        name: 'john doe'
      })
    })
  })
})