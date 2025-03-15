import { Pet, Prisma } from '@prisma/client'

export interface FetchPetsParams {
  name?: string
  age?: number
  breed?: string
  size?: string
  city: string
  orgId?: string
}

export interface PetsRepository {
  create(pet: Prisma.PetUncheckedCreateInput): Promise<Pet>
  searchPets(params: FetchPetsParams): Promise<Pet[]>
}
