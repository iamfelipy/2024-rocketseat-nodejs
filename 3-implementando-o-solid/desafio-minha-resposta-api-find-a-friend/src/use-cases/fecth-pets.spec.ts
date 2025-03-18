import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPetsUseCase } from './fetch-pets'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let petsRepository: InMemoryPetsRepository
let sut: FetchPetsUseCase

describe('Fetch Pets Use case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new FetchPetsUseCase(petsRepository)
  })
  it('should be able to return pets available in a specific city', async () => {
    await petsRepository.create({
      id: 'pet-01',
      name: 'Rex',
      age: 2,
      breed: 'Poodle',
      size: 'small',
      city: 'sao-paulo',
      org_id: 'org-01',
    })
    await petsRepository.create({
      id: 'pet-02',
      name: 'Veloz',
      age: 5,
      breed: 'Rotweiller',
      size: 'big',
      city: 'rio-de-janeiro',
      org_id: 'org-02',
    })
    const { pets } = await sut.execute({ city: 'sao-paulo' })

    expect(pets.length).toEqual(1)
    expect(pets[0].id).toEqual('pet-01')
  })
})
