import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsUseCaseRequest {
  name?: string
  age?: number
  breed?: string
  size?: string
  city: string
  orgId?: string
}
interface FetchPetsUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    age,
    breed,
    size,
    city,
    orgId,
  }: FetchPetsUseCaseRequest): Promise<FetchPetsUseCaseResponse> {
    const pets = await this.petsRepository.searchPets({
      name,
      age,
      breed,
      size,
      city,
      orgId,
    })
    return { pets }
  }
}
