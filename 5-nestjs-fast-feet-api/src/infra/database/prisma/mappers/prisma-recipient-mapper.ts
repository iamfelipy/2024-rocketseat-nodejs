import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import {
  User as PrismaUser,
  UserRole as UserRolePrisma,
  Prisma,
} from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaUser): Recipient {
    return Recipient.create(
      {
        cpf: raw.cpf,
        password: raw.password,
        name: raw.name,
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

  static toPrisma(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      cpf: recipient.cpf,
      password: recipient.password,
      name: recipient.name,
      roles: recipient.roles.map(
        (role) =>
          UserRolePrisma[role as unknown as keyof typeof UserRolePrisma],
      ),
      address: recipient.location.address,
      latitude: recipient.location.latitude,
      longitude: recipient.location.longitude,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
