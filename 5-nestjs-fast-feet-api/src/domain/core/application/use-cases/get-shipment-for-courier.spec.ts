import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins'
import { InMemoryShipmentsRepository } from 'test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetShipmentForCourierUseCase } from './get-shipment-for-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { InMemoryShipmentAttachmentsRepository } from 'test/repositories/in-memory-shipment-attachments-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { makeCourier } from 'test/factories/make-courier'
import { makeShipment } from 'test/factories/make-shipment'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeShipmentAttachment } from 'test/factories/make-shipment-attachment'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: GetShipmentForCourierUseCase

describe('Get Shipment For Courier', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryShipmentAttachmentsRepository =
      new InMemoryShipmentAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository,
      inMemoryShipmentAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new GetShipmentForCourierUseCase(
      inMemoryShipmentsRepository,
      inMemoryCouriersRepository,
    )
  })
  it('should allow a courier to get his own shipment', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const shipment = makeShipment({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const attachment = makeAttachment()
    inMemoryAttachmentsRepository.items.push(attachment)

    const shipmentAttachment = makeShipmentAttachment({
      shipmentId: shipment.id,
      attachmentId: attachment.id,
    })
    inMemoryShipmentAttachmentsRepository.items.push(shipmentAttachment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipment.shipmentId).toEqual(
      shipment.id,
    )
    expect(result.isRight() && result.value.shipment.courierId).toEqual(
      courier.id,
    )
    expect(result.isRight() && result.value.shipment.courier).toEqual(
      courier.name,
    )
    expect(result.isRight() && result.value.shipment.recipientId).toEqual(
      recipient.id,
    )
    expect(result.isRight() && result.value.shipment.recipient).toEqual(
      recipient.name,
    )
  })
  it('should not allow a non-existent courier to get a shipment', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: 'non-existent-courier-id',
      shipmentId: shipment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if shipment does not exist', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: 'non-existent-shipment-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
