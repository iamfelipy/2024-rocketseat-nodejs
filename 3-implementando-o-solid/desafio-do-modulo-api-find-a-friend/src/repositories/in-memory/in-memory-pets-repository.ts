import { Pet, Prisma } from '@prisma/client'
import { FetchPetsParams, PetsRepository } from '../pets-repository'
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

  async searchPets(param: FetchPetsParams): Promise<Pet[]> {
    const pets = this.items.filter((pet) => {
      return Object.entries(param).every(([key, value]) => {
        if (value === undefined || value === '') {
          return true
        }

        if (key === 'orgId') {
          return pet.org_id === value
        }
        if (key === 'age') {
          return pet[key as keyof Pet] === Number(value)
        }
        return pet[key as keyof Pet] === value
      })
    })
    return pets
  }

  async findById(petId: string): Promise<Pet | null> {
    const pet = this.items.find((pet) => pet.id === petId)

    if (!pet) {
      return null
    }

    return pet
  }
}
