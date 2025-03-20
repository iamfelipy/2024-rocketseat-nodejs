import { Pet, Prisma } from '@prisma/client'
import { FindAllParams, PetsRepository } from '../pets.repository'
import { InMemoryOrgsRepository } from './in-memory-orgs.repository'

export class InMemoryPetsRepository implements PetsRepository {
  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findAll(params: FindAllParams): Promise<Pet[]> {
    const orgsByCity = this.orgsRepository.items.filter(
      (org) => org.city === params.city,
    )

    const pets = this.items
      .filter((item) => orgsByCity.some((org) => org.id === item.org_id))
      .filter((item) => (params.age ? item.age === params.age : true))
      .filter((item) => (params.size ? item.size === params.size : true))
      .filter((item) =>
        params.energy_level ? item.energy_level === params.energy_level : true,
      )
      .filter((item) =>
        params.environment ? item.environment === params.environment : true,
      )

    return pets
  }

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  public items: Pet[] = []
  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: crypto.randomUUID(),
      ...data,
    }

    this.items.push(pet)

    return pet
  }
}
