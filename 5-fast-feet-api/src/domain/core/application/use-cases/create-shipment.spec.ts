import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients"
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments"
import { beforeEach, describe, expect, it } from "vitest"
import { CreateShipmentUseCase } from "./create-shipment"
import { makeAdmin } from "@/test/factories/make-admin"
import { makeRecipient } from "@/test/factories/make-recipient"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: CreateShipmentUseCase

describe('Create Shipment', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository)
    sut = new CreateShipmentUseCase(inMemoryShipmentsRepository, inMemoryRecipientsRepository, inMemoryAdminsRepository)
  })
  it('should be able to create a new shipment', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)
    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      adminId: admin.id.toString()
    })
    
    expect(result.isRight()).toBe(true)
    expect(inMemoryShipmentsRepository.items[0]).toMatchObject({
      recipientId: recipient.id
    })
  })

  it('should not allow non-admin to create a shipment', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)
    
    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      adminId: recipient.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
    expect(inMemoryShipmentsRepository.items.length).toBe(0)
  })
})