import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  create(pet: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
