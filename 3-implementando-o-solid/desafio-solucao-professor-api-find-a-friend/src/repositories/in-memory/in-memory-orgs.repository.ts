import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs.repository'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findByEmail(email: string): Promise<Org | null> {
    return this.items.find((org) => org.email === email) || null
  }

  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = {
      id: crypto.randomUUID(),
      ...data,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.items.push(org)

    return org
  }
}
