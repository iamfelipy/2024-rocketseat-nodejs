import { FakeEncrypter } from "@/test/cryptography/fake-encrypter";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateRecipientUseCase } from "./authenticate-recipient";
import { makeRecipient } from "@/test/factories/make-recipient";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateRecipientUseCase

describe('Authenticate recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateRecipientUseCase(
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeEncrypter
    )
  })
  it('should be able to authenticate a recipient', async () => {
    const recipient = makeRecipient({
      cpf: '12345677899',
      password: await fakeHasher.hash('123456')
    })
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      cpf: recipient.cpf,
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })
})