import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

let petsRepository: PetsRepository
let orgsRepository: OrgsRepository
let createPetUseCase: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    createPetUseCase = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await orgsRepository.create({
      id: 'org-01',
      name: 'Org 01',
      email: 'org-01@gmail.com',
      password_hash: '123456',
      address: '123 Main St',
      whatsapp: '123456789',
    })

    const { pet } = await createPetUseCase.execute({
      name: 'Buddy',
      age: 3,
      breed: 'Golden Retriever',
      size: 'Large',
      city: 'New York',
      description: 'A very friendly dog',
      orgId: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to create a pet with an invalid org id', async () => {
    await expect(
      createPetUseCase.execute({
        name: 'Buddy',
        age: 3,
        breed: 'Golden Retriever',
        size: 'Large',
        city: 'New York',
        description: 'A very friendly dog',
        orgId: 'invalid-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
