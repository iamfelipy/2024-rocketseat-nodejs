import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Admin, AdminProps } from "@/domain/core/enterprise/entities/admin";
import { Location } from "@/domain/core/enterprise/entities/value-objects/location";
import { faker } from '@faker-js/faker'


export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID
) {
  const admin = Admin.create({
    name: faker.person.fullName(),
    cpf: faker.string.numeric(11),
    password: faker.internet.password(),
    location: Location.create({
      address: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }),
    ...override,
  }, id)

  return admin
}