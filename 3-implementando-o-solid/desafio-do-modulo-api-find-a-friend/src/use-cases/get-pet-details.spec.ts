import { describe, it, expect, beforeEach } from 'vitest'
import { GetPetDetailsUseCase } from './get-pet-details'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('GetPetDetails Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetDetailsUseCase(petsRepository)
  })
  it('should return pet details for a valid pet ID', async () => {
    const { id: petId } = await petsRepository.create({
      name: 'Buddy',
      age: 3,
      breed: 'Golden Retriever',
      org_id: 'owner-123',
      size: 'medium',
      city: 'sao-paulo',
    })

    const { pet } = await sut.execute({ petId })

    expect(pet?.id).toEqual(petId)
  })

  it('should throw an error if pet ID is invalid', async () => {
    await expect(sut.execute({ petId: 'invalid-id' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
