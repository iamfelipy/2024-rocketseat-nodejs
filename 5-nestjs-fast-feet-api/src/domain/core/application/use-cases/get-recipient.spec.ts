import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { GetRecipientUseCase } from './get-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: GetRecipientUseCase

describe('Get Recipient By Admin', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new GetRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdminsRepository,
    )
  })
  it('should allow admin to get a recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        id: recipient.id,
      }),
    })
  })
  it('should not allow a non-admin user to get a recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-admin-id',
      recipientId: recipient.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  it('should not allow fetching a recipient that does not exist', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: 'invalid-recipient-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
