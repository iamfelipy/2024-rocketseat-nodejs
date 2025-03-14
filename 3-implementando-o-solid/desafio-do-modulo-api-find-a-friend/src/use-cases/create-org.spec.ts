import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { CreateOrgUseCase } from '@/use-cases/create-org'
import { OrgAlreadyExistsError } from './errors/org-already-exists'
import { compare } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('should be able to create org', async () => {
    const { org } = await sut.execute({
      name: 'name-org',
      email: 'org@email.com',
      password: '123456',
      address: 'Rua Nações, 185, itajai, SC',
      whatsapp: '47999999999',
    })

    expect(org.id).toEqual(expect.any(String))
  })
  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'name-org',
      email: 'org@email.com',
      password: '123456',
      address: 'Rua Nações, 185, itajai, SC',
      whatsapp: '47999999999',
    })
    expect(
      async () =>
        await sut.execute({
          name: 'name-org',
          email: 'org@email.com',
          password: '123456',
          address: 'Rua Nações, 185, itajai, SC',
          whatsapp: '47999999999',
        }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'name-org',
      email: 'org@email.com',
      password: '123456',
      address: 'Rua Nações, 185, itajai, SC',
      whatsapp: '47999999999',
    })

    const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHashed).toEqual(true)
  })
})
