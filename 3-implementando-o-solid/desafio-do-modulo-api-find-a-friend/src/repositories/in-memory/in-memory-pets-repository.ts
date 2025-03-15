import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      age: data.age,
      breed: data.breed,
      size: data.size,
      city: data.city,
      description: data.description ?? null,
      org_id: data.org_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}
