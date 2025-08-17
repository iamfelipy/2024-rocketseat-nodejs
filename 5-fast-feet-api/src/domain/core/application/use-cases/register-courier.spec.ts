import { beforeEach, describe, expect, it } from "vitest";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers";
import { RegisterCourierUseCase } from "./register-courier";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { makeAdmin } from "@/test/factories/make-admin";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterCourierUseCase

describe('Register Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterCourierUseCase(inMemoryCouriersRepository,inMemoryAdminsRepository, fakeHasher)
  })
  it('should be able to register a courier', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)
    
    const result = await sut.execute({
      name: 'John Doe',
      password: '123456',
      cpf: '06450388855',
      address: '',
      latitude: 0,
      longitude: 0,
      adminId: admin.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0]
    })
  })
  it('should hash courier password upon registration', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)
    
    const result = await sut.execute({
      name: 'John Doe',
      password: '123456',
      cpf: '06450388855',
      address: '',
      latitude: 0,
      longitude: 0,
      adminId: admin.id.toString()
    })

    expect(inMemoryCouriersRepository.items[0].password).toEqual(
      '123456-hashed'
    )
  })
  it('should not allow non-admin to register a courier', async () => {
    const fakeAdmin = makeAdmin()

    const result = await sut.execute({
      name: 'Jane Doe',
      password: '654321',
      cpf: '12345678900',
      address: 'Rua Teste',
      latitude: 10,
      longitude: 20,
      adminId: fakeAdmin.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
    expect(inMemoryCouriersRepository.items.length).toBe(0)
  })
})