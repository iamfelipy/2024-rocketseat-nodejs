import { beforeEach, describe, expect, it } from "vitest";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { RegisterAdminUseCase } from "./register-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Register Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })
  it('should be able to register a admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      password: '123456',
      cpf: '06450388855',
      address: '',
      latitude: 0,
      longitude: 0
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0]
    })
  })
})