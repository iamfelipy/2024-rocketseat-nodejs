import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Attachment, AttachmentProps } from "@/domain/core/enterprise/entities/attachment";
import { faker } from "@faker-js/faker";

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID
) {
  const attachment = Attachment.create({
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    ...override
  }, id)

  return attachment
}