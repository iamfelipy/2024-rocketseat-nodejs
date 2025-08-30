import { makeAdmin } from "@/test/factories/make-admin";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteRecipientUseCase } from "./delete-recipient";
import { makeRecipient } from "@/test/factories/make-recipient";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository, inMemoryAdminsRepository)
  })
  it('should be able to delete a recipient', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString()
    })
    
    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })
  it('should not allow a non-admin user to delete a recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-admin-id',
      recipientId: recipient.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
    expect(inMemoryRecipientsRepository.items).toHaveLength(1)
  })
  it('should not allow deleting a recipient that does not exist', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: 'invalid-recipient-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})