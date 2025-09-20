import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'
import { Location } from '@/domain/core/enterprise/entities/value-objects/location'
import { User as PrismaUser } from '@prisma/client'

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
}
