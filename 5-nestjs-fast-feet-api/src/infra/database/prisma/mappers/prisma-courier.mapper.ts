import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'
import { Courier } from '@/domain/core/enterprise/entities/courier'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import {
  User as PrismaUser,
  UserRole as UserRolePrisma,
  Prisma,
} from '@prisma/client'

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        roles: raw.roles as UserRole[],
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

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      cpf: courier.cpf,
      password: courier.password,
      name: courier.name,
      roles: courier.roles as UserRolePrisma[],
      address: courier.location.address,
      latitude: courier.location.latitude,
      longitude: courier.location.longitude,
      createdAt: courier.createdAt,
      updatedAt: courier.updatedAt,
    }
  }
}
