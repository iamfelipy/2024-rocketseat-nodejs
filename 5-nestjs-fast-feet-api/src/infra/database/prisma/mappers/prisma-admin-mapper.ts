import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'
import { Admin } from '@/domain/core/enterprise/entities/admin'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import {
  User as PrismaUser,
  UserRole as UserRolePrisma,
  Prisma,
} from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        roles: raw.roles.map((role) => UserRole[role]),
        location: Location.create({
          address: raw.address,
          latitude: raw.latitude.toNumber(),
          longitude: raw.longitude.toNumber(),
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      cpf: admin.cpf,
      password: admin.password,
      name: admin.name,
      roles: admin.roles.map((role) => UserRolePrisma[role]),
      address: admin.location.address,
      latitude: admin.location.latitude,
      longitude: admin.location.longitude,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
