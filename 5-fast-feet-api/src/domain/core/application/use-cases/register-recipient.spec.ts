import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { RegisterRecipientUsecase } from "./register-recipient";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { makeAdmin } from "@/test/factories/make-admin";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterRecipientUsecase

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterRecipientUsecase(inMemoryRecipientsRepository,inMemoryAdminsRepository, fakeHasher)
  })
  it('should be able to register a recipient', async () => {
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
      recipient: inMemoryRecipientsRepository.items[0]
    })
  })
  it('should hash recipient password upon registration', async () => {
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

    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      '123456-hashed'
    )
  })
  it('should not allow non-admin to register a recipient', async () => {
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
    expect(inMemoryRecipientsRepository.items.length).toBe(0)
  })
})