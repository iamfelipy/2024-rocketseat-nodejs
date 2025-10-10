import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/core/enterprise/entities/admin'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      location: Location.create({
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }),
      ...override,
    },
    id,
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
