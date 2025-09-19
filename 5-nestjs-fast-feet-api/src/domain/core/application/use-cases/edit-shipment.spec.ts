import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients";
import { InMemoryShipmentAttachmentsRepository } from "test/repositories/in-memory-shipment-attachments-repository";
import { InMemoryShipmentsRepository } from "test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { EditShipmentUseCase } from "./edit-shipment";
import { makeShipment } from "test/factories/make-shipment";
import { makeCourier } from "test/factories/make-courier";
import { makeAdmin } from "test/factories/make-admin";
import { makeRecipient } from "test/factories/make-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeShipmentAttachment } from "test/factories/make-shipment-attachment";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { ShipmentStatusInvalidError } from "./erros/shipment-status-invalid-error";

let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: EditShipmentUseCase

describe('Edit shipment', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new EditShipmentUseCase(
      inMemoryShipmentsRepository,
      inMemoryShipmentAttachmentsRepository,
      inMemoryRecipientsRepository,
      inMemoryCouriersRepository,
      inMemoryAdminsRepository
    )
  })
  it('should be able to edit a edit shipment', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin({}, new UniqueEntityID('admin-1'))
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({}, new UniqueEntityID('shipment-1'))
    inMemoryShipmentsRepository.items.push(shipment)
    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({
        shipmentId: shipment.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeShipmentAttachment({
        shipmentId: shipment.id,
        attachmentId: new UniqueEntityID('2')
      })
    )

    const result = await sut.execute({
      adminId: 'admin-1',
      shipmentId: 'shipment-1',
      statusShipment: "PICKED_UP",
      recipientId: recipient.id.toString(),
      pickupDate: new Date(),
      deliveryDate: new Date(),
      returnedDate: new Date(),
      attachmentsIds: ['1','3'],
      courierId: courier.id.toString()
    })


    expect(inMemoryShipmentsRepository.items[0]).toMatchObject({
      statusShipment: "PICKED_UP",
      recipientId: recipient.id,
      pickupDate: expect.any(Date),
      deliveryDate: expect.any(Date),
      returnedDate: expect.any(Date),
      courierId: courier.id,
    })
    expect(inMemoryShipmentsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryShipmentsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1')
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3')
      }),
    ])
  })
  it('should not be able to edit a shipment if non-admin user', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({}, new UniqueEntityID('shipment-1'))
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'non-existent-admin-id',
      shipmentId: 'shipment-1',
      statusShipment: "PICKED_UP",
      recipientId: recipient.id.toString(),
      attachmentsIds: [],
      courierId: courier.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)

  })
  it('should not be able to edit a shipment if shipment does not exist', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin({}, new UniqueEntityID('admin-1'))
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({})
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'admin-1',
      shipmentId: 'non-existent-shipment-id',
      statusShipment: "PICKED_UP",
      recipientId: recipient.id.toString(),
      attachmentsIds: [],
      courierId: courier.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to edit a shipment if recipient is not empty and does not exist', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin({}, new UniqueEntityID('admin-1'))
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({}, new UniqueEntityID('shipment-1'))
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'admin-1',
      shipmentId: 'shipment-1',
      statusShipment: "PICKED_UP",
      recipientId: 'non-existent-recipient-id',
      attachmentsIds: [],
      courierId: courier.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to edit a shipment if courier is not empty and does not exist', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin({})
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({})
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString(),
      statusShipment: "PICKED_UP",
      recipientId: recipient.id.toString(),
      attachmentsIds: [],
      courierId: 'non-existent-courier-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to edit a shipment if statusShipment is not invalid', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin({})
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({})
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString(),
      statusShipment: "INVALID_STATUS",
      recipientId: recipient.id.toString(),
      attachmentsIds: [],
      courierId: courier.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ShipmentStatusInvalidError)
  })
  it('should sync new and removed attachments when editing a shipment', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)
    inMemoryShipmentAttachmentsRepository.items.push(
      makeShipmentAttachment({
        shipmentId: shipment.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeShipmentAttachment({
        shipmentId: shipment.id,
        attachmentId: new UniqueEntityID('2')
      })
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString(),
      statusShipment: "PICKED_UP",
      recipientId: recipient.id.toString(),
      attachmentsIds: ['1','3'],
      courierId: courier.id.toString()
    })

    expect(inMemoryShipmentsRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryShipmentsRepository.items[0].attachments.currentItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    )
  })
})