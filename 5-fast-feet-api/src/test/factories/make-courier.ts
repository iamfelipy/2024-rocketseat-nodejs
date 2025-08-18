import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Courier, CourierProps } from "@/domain/core/enterprise/entities/courier";
import { Location } from "@/domain/core/enterprise/entities/value-objects/location";
import { faker } from '@faker-js/faker'

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityID
) {
  const courier = Courier.create({
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

  return courier
}