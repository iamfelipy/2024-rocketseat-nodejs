import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { GetCourierByIdUseCase } from "./get-courier"
import { makeCourier } from "@/test/factories/make-courier"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: GetCourierByIdUseCase

describe('Get Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new GetCourierByIdUseCase(inMemoryCouriersRepository)
  })
  it('should be able to get a courier by Id', async () => {
    const courier = makeCourier({name: 'john doe'}, new UniqueEntityID('courier-1'))

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId: 'courier-1'
    })
    
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      courier: expect.objectContaining({
        name: 'john doe'
      })
    })
  })
})