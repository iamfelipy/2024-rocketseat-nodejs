import { FakeEncrypter } from "@/test/cryptography/fake-encrypter";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateCourierUseCase } from "./authenticate-courier";
import { makeCourier } from "@/test/factories/make-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateCourierUseCase

describe('Authenticate Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierUseCase(inMemoryCouriersRepository, fakeHasher, fakeEncrypter)
  })
  it('should be able to authenticate a courier', async () => {
    const courier = makeCourier({
      cpf: '11233344455',
      password: await fakeHasher.hash('123456')
    })
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      cpf: courier.cpf,
      password: '123456'
    })
    
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })
})