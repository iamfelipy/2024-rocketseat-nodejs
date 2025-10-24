import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { makeCourier } from 'test/factories/make-courier'
import { makeShipment } from 'test/factories/make-shipment'
import { makeShipmentAttachment } from 'test/factories/make-shipment-attachment'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { InMemoryShipmentAttachmentsRepository } from 'test/repositories/in-memory-shipment-attachments-repository'
import { InMemoryShipmentsRepository } from 'test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { MarkShipmentAsDeliveredUseCase } from './mark-shipment-as-delivered'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ShipmentNotAssignedToCourierError } from './erros/shipment-not-assigned-to-courier-error'
import { PhotoRequiredForDeliveryError } from './erros/photo-required-for-delivery-error'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: MarkShipmentAsDeliveredUseCase

describe('Mark shipment as delivered', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryShipmentAttachmentsRepository =
      new InMemoryShipmentAttachmentsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(
      inMemoryRecipientsRepository,
      inMemoryShipmentAttachmentsRepository,
    )
    sut = new MarkShipmentAsDeliveredUseCase(
      inMemoryShipmentsRepository,
      inMemoryCouriersRepository,
      inMemoryShipmentAttachmentsRepository,
    )
  })
  it('should be able to mark a shipment as delivered', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({}, new UniqueEntityID('1')),
      makeShipmentAttachment({}, new UniqueEntityID('2')),
    )

    const shipment = makeShipment({
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryShipmentAttachmentsRepository.items).toHaveLength(2)
    expect(result.value).toEqual({
      shipment: expect.objectContaining({
        statusShipment: ShipmentStatus.DELIVERED,
        deliveryDate: expect.any(Date),
      }),
    })
  })

  it('should return an error if the courier does not exist', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({}, new UniqueEntityID('1')),
      makeShipmentAttachment({}, new UniqueEntityID('2')),
    )

    const shipment = makeShipment({
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: 'invalid-courier-id',
      shipmentId: shipment.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the shipment does not exist', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({}, new UniqueEntityID('1')),
      makeShipmentAttachment({}, new UniqueEntityID('2')),
    )

    const shipment = makeShipment({
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: 'invalid-shipment-id',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not allow marking as delivered if the courier is not the one assigned to the shipment', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({}, new UniqueEntityID('1')),
      makeShipmentAttachment({}, new UniqueEntityID('2')),
    )

    const shipment = makeShipment({
      courierId: new UniqueEntityID('other-courier-id'),
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString(),
      attachmentsIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ShipmentNotAssignedToCourierError)
  })

  it('should not allow marking as delivered if no photo is attached', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({}, new UniqueEntityID('1')),
      makeShipmentAttachment({}, new UniqueEntityID('2')),
    )

    const shipment = makeShipment({
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhotoRequiredForDeliveryError)
  })

  it('should persist attachments the shipment when marking it as delivered', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const shipment = makeShipment({
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const attachment1 = makeShipmentAttachment()
    const attachment2 = makeShipmentAttachment()

    inMemoryShipmentAttachmentsRepository.items.push(attachment1, attachment2)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString(),
      attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryShipmentAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryShipmentAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shipmentId: attachment1.shipmentId,
          attachmentId: attachment1.attachmentId,
        }),
        expect.objectContaining({
          shipmentId: attachment2.shipmentId,
          attachmentId: attachment2.attachmentId,
        }),
      ]),
    )
  })
})
