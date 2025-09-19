import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/core/enterprise/entities/recipient";
import { Location } from "@/domain/core/enterprise/entities/value-objects/location";
import { faker } from '@faker-js/faker'


export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID
) {
  const recipient = Recipient.create({
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

  return recipient
}