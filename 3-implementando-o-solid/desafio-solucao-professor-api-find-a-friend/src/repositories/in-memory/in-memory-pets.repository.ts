import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets.repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []
  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: crypto.randomUUID(),
      ...data,
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
