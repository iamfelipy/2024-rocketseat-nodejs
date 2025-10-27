import { InMemoryShipmentsRepository } from 'test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchShipmentsUseCase } from './fetch-shipments'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { InMemoryShipmentAttachmentsRepository } from 'test/repositories/in-memory-shipment-attachments-repository'
import { makeShipment } from 'test/factories/make-shipment'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeCourier } from 'test/factories/make-courier'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchShipmentsUseCase

describe('Fetch Shipments with Recipient and Courier', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryShipmentAttachmentsRepository =
      new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository,
      inMemoryShipmentAttachmentsRepository,
    )
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new FetchShipmentsUseCase(
      inMemoryShipmentsRepository,
      inMemoryAdminsRepository,
    )
  })
  it('should be able to fetch shipments', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    inMemoryShipmentsRepository.items.push(
      makeShipment({
        courierId: courier.id,
        recipientId: recipient.id,
      }),
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    const shipments = result.isRight() ? result.value?.shipments : []
    expect(shipments.length).toBeGreaterThan(0)
    const shipment = shipments[0]
    expect(shipment.recipientId.toString()).toBe(recipient.id.toString())
    expect(shipment.recipient).toBe(recipient.name)
    expect(shipment.courierId?.toString()).toBe(courier.id.toString())
    expect(shipment.courier).toBe(courier.name)
  })
  it('should be able to fetch paginated shipments', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 22; i++) {
      inMemoryShipmentsRepository.items.push(
        makeShipment(
          { recipientId: recipient.id },
          new UniqueEntityID(i.toString()),
        ),
      )
    }
    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipments).toHaveLength(2)
  })
})
