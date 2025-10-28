import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients'
import { InMemoryShipmentAttachmentsRepository } from 'test/repositories/in-memory-shipment-attachments-repository'
import { InMemoryShipmentsRepository } from 'test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetShipmentUseCase } from './get-shipment'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins'
import { makeShipment } from 'test/factories/make-shipment'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeCourier } from 'test/factories/make-courier'
import { makeAttachment } from 'test/factories/make-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentAttachment } from '../../enterprise/entities/shipment-attachment'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: GetShipmentUseCase

describe('Get Shipment', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryShipmentAttachmentsRepository =
      new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository,
      inMemoryShipmentAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new GetShipmentUseCase(
      inMemoryShipmentsRepository,
      inMemoryAdminsRepository,
    )
  })
  it('should be able to get a shipment', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const shipment = makeShipment({
      recipientId: recipient.id,
      courierId: courier.id,
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const attachment = makeAttachment({}, new UniqueEntityID('1'))
    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryShipmentAttachmentsRepository.items.push(
      ShipmentAttachment.create({
        attachmentId: attachment.id,
        shipmentId: shipment.id,
      }),
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.shipment.shipmentId).toEqual(
      shipment.id,
    )
    expect(result.isRight() && result.value.shipment.recipientId).toEqual(
      recipient.id,
    )
    expect(result.isRight() && result.value.shipment.recipient).toEqual(
      recipient.name,
    )
    expect(result.isRight() && result.value.shipment.courierId).toEqual(
      courier.id,
    )
    expect(result.isRight() && result.value.shipment.courier).toEqual(
      courier.name,
    )
    expect(result.isRight() && result.value.shipment.attachments).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('1'),
      }),
    ])
  })
  it('should not allow non-admin to get a shipment', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'invalid-id-admin',
      shipmentId: shipment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  // should return an error if shipment does not exist
  it('should return an error if shipment does not exist', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: 'non-existent-shipment-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
