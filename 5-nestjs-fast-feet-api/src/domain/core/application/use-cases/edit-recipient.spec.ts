import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeAdmin } from 'test/factories/make-admin'
import { Location } from '../../enterprise/entities/value-objects/location'
import { UserRole } from '@/core/enums/enum-user-role'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { EditRecipientUseCase } from './edit-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new EditRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdminsRepository,
    )
  })
  it('should allow to edit a recipient', async () => {
    const recipient = makeRecipient({
      cpf: '12345678900',
      password: 'initialPassword',
      roles: [UserRole.COURIER],
      name: 'Initial Courier',
      location: Location.create({
        address: 'Initial Address',
        latitude: 10,
        longitude: 20,
      }),
    })
    inMemoryRecipientsRepository.items.push(recipient)
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      adminId: admin.id.toString(),
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: 'Updated Recipient',
      address: 'Updated Address',
      latitude: 30,
      longitude: 40,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        roles: [UserRole.COURIER, UserRole.ADMIN],
        name: 'Updated Recipient',
        location: expect.objectContaining({
          address: 'Updated Address',
          latitude: 30,
          longitude: 40,
        }),
      }),
    })
  })

  it('should not allow a non-admin to edit a recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      adminId: 'non-admin',
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: 'Updated Recipient',
      address: 'Updated Address',
      latitude: 30,
      longitude: 40,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should return an error if recipient does not exist', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      recipientId: 'invalid-id-recipient',
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: 'Updated Recipient',
      address: 'Updated Address',
      latitude: 30,
      longitude: 40,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
