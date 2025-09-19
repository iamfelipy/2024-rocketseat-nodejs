import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients";
import { beforeEach, describe, expect, it } from "vitest";
import { GetRecipientProfileUseCase } from "./get-recipient-profile";
import { makeRecipient } from "test/factories/make-recipient";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientProfileUseCase

describe('Get Recipient Profile', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientProfileUseCase(inMemoryRecipientsRepository)
  })
  it('shoud be able to get recipient profile', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        id: recipient.id
      })
    })
  })
  it('should not allow fetching a recipient that does not exist', async () => {
    const result = await sut.execute({
      recipientId: 'invalid-recipient-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})