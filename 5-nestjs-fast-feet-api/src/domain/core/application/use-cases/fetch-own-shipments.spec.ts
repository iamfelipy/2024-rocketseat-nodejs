import { InMemoryShipmentsRepository } from 'test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { InMemoryShipmentAttachmentsRepository } from 'test/repositories/in-memory-shipment-attachments-repository'
import { makeShipment } from 'test/factories/make-shipment'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { makeCourier } from 'test/factories/make-courier'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchOwnShipmentsUseCase } from './fetch-own-shipments'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: FetchOwnShipmentsUseCase

describe('Fetch shipments by courier', () => {
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
    sut = new FetchOwnShipmentsUseCase(inMemoryShipmentsRepository)
  })
  it('should be able to fetch shipments by courier', async () => {
    const courier1 = makeCourier()
    const courier2 = makeCourier()
    inMemoryCouriersRepository.items.push(courier1, courier2)

    const shipment1 = makeShipment({ courierId: courier1.id })
    const shipment2 = makeShipment({ courierId: courier1.id })
    const shipment3 = makeShipment({ courierId: courier2.id })

    inMemoryShipmentsRepository.items.push(shipment1, shipment2, shipment3)

    const result = await sut.execute({
      userId: courier1.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipments).toHaveLength(2)
    expect(result.value).toEqual({
      shipments: [
        expect.objectContaining({
          id: shipment1.id,
        }),
        expect.objectContaining({
          id: shipment2.id,
        }),
      ],
    })
  })
  it('should be able to fetch shipments by recipient', async () => {
    const recipient1 = makeRecipient()
    const recipient2 = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient1, recipient2)

    const shipment1 = makeShipment({ recipientId: recipient1.id })
    const shipment2 = makeShipment({ recipientId: recipient1.id })
    const shipment3 = makeShipment({ recipientId: recipient2.id })

    inMemoryShipmentsRepository.items.push(shipment1, shipment2, shipment3)

    const result = await sut.execute({
      userId: recipient1.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipments).toHaveLength(2)
    expect(result.value).toEqual({
      shipments: [
        expect.objectContaining({
          id: shipment1.id,
        }),
        expect.objectContaining({
          id: shipment2.id,
        }),
      ],
    })
  })
  it('should be able to fetch paginated shipments', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    for (let i = 1; i <= 22; i++) {
      inMemoryShipmentsRepository.items.push(
        makeShipment(
          {
            courierId: courier.id,
          },
          new UniqueEntityID(i.toString()),
        ),
      )
    }
    const result = await sut.execute({
      userId: courier.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipments).toHaveLength(2)
    expect(result.value).toEqual({
      shipments: [
        expect.objectContaining({
          id: new UniqueEntityID('21'),
        }),
        expect.objectContaining({
          id: new UniqueEntityID('22'),
        }),
      ],
    })
  })
})
