import { OrgsRepository } from '@/repositories/orgs-repository'
import { Prisma, Org } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  private items: Org[] = []

  async create(data: Prisma.OrgUncheckedCreateInput): Promise<Org> {
    const org: Org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      whatsapp: data.whatsapp,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(org)
    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.items.find((org) => org.email === email)

    if (!org) {
      return null
    }

    return org
  }
}
