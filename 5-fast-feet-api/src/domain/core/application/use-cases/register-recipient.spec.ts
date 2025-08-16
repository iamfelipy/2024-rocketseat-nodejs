import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { RegisterRecipientUsecase } from "./register-recipient";
import { FakeHasher } from "@/test/cryptography/fake-hasher";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher
let sut: RegisterRecipientUsecase

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterRecipientUsecase(inMemoryRecipientsRepository, fakeHasher)
  })
  it('should be able to register a recipient', async () => {
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
      recipient: inMemoryRecipientsRepository.items[0]
    })
  })
  it('should hash recipient password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      password: '123456',
      cpf: '06450388855',
      address: '',
      latitude: 0,
      longitude: 0
    })

    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      '123456-hashed'
    )
  })
})