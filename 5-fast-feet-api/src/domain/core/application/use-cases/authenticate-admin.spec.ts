import { makeAdmin } from "test/factories/make-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins";
import { beforeEach, describe, expect, it } from "vitest";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateAdminUseCase } from "./authenticate-admin";
import { WrongCredentialsError } from "./erros/wrong-credentials-error";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateAdminUseCase


describe('Authenticate admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter
    )
  })
  it('should ber able to authenticate a admin', async () => {
    const admin = makeAdmin({
      cpf: '12345678966',
      password: await fakeHasher.hash('123456')
    })  
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: admin.cpf,
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })
  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      cpf: '00000000000',
      password: '123456'
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const admin = makeAdmin({
      cpf: '12345678966',
      password: await fakeHasher.hash('123456')
    })  
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: admin.cpf,
      password: 'wrong-password'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})