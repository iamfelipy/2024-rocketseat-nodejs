import { Pet, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { FetchPetsParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async searchPets(params: FetchPetsParams): Promise<Pet[]> {
    const { name, age, breed, size, city, orgId } = params

    const pets = await prisma.pet.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        age: age || undefined,
        breed: breed ? { contains: breed, mode: 'insensitive' } : undefined,
        size: size ? { contains: size, mode: 'insensitive' } : undefined,
        city: city ? { contains: city, mode: 'insensitive' } : undefined,
        org_id: orgId || undefined,
      },
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(petId: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    })

    return pet
  }
}
