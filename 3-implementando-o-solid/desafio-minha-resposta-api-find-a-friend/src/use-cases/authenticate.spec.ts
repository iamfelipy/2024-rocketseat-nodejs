import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })
  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      name: 'name-org',
      email: 'org@email.com',
      password_hash: await hash('123456', 6),
      address: 'Rua Nações, 185, itajai, SC',
      whatsapp: '47999999999',
    })

    const { org } = await sut.execute({
      email: 'org@email.com',
      password: '123456',
    })
    expect(org.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'non-existent-email@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    await orgsRepository.create({
      name: 'name-org',
      email: 'org@email.com',
      password_hash: await hash('123456', 6),
      address: 'Rua Nações, 185, itajai, SC',
      whatsapp: '47999999999',
    })

    await expect(() =>
      sut.execute({
        email: 'org@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
