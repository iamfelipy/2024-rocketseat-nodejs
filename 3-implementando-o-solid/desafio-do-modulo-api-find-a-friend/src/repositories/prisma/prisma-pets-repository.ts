import { Pet, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { FetchPetsParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  searchPets(params: FetchPetsParams): Promise<Pet[]> {
    throw new Error('Method not implemented.')
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }
}
