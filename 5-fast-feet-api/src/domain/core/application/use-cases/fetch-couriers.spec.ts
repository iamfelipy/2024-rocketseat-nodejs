import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { FetchCouriersUseCase } from "./fetch-couriers"
import { makeCourier } from "@/test/factories/make-courier"
import { makeAdmin } from "@/test/factories/make-admin"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchCouriersUseCase

describe('Fetch Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository
    inMemoryAdminsRepository = new InMemoryAdminsRepository
    sut = new FetchCouriersUseCase(inMemoryCouriersRepository, inMemoryAdminsRepository)
  })
  it('should be able to fetch couriers', async () => {
    const courier1 = makeCourier({name: 'courier-1'})
    const courier2 = makeCourier({name: 'courier-2'})
    
    Promise.all([
      inMemoryCouriersRepository.create(courier1),
      inMemoryCouriersRepository.create(courier2),
    ])

    const admin = makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      {
        couriers: [
          expect.objectContaining({
            name: 'courier-1'
          }),
          expect.objectContaining({
            name: 'courier-2'
          })
        ]
      }
    )
  })
  it('should not allow fetch couriers if user is not admin', async () => {
    
    const result = await sut.execute({
      adminId: 'invalid-id',
      page: 1
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  it('should be able to fetch paginated couriers', async () => {
    for (let i = 0; i < 22; i++) {
      const courier = makeCourier({ name: `courier-${i + 1}` })
      await inMemoryCouriersRepository.create(courier)
    }

    const admin = makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 2
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      couriers: [
        expect.objectContaining({
          name: 'courier-21'
        }),
        expect.objectContaining({
          name: 'courier-22'
        })
      ]
    })
  })
})