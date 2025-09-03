import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { ChangeCourierPasswordUseCase } from "./change-courier-password"
import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { makeAdmin } from "@/test/factories/make-admin"
import { makeCourier } from "@/test/factories/make-courier"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: ChangeCourierPasswordUseCase

describe("Change courier password", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeCourierPasswordUseCase(
      inMemoryCouriersRepository, 
      inMemoryAdminsRepository, 
      fakeHasher
    )
  })
  it("should be able to change a courier password", async ()=> {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const courier = makeCourier({
      password: await fakeHasher.hash('123456')
    })
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: courier.id.toString(),
      newPassword: 'updated-password'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      password: await fakeHasher.hash('updated-password')
    })
  })
})