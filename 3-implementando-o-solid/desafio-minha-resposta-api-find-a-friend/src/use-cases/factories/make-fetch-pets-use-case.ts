import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FetchPetsUseCase } from '../fetch-pets'

export function makeFetchPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const fetchPetUseCase = new FetchPetsUseCase(petsRepository)

  return fetchPetUseCase
}
