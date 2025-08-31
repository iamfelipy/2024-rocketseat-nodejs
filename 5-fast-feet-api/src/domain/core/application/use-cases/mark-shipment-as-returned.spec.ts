import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { MarkShipmentAsReturned } from "./mark-shipment-as-returned";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { InMemoryShipmentAttachmentsRepository } from "@/test/repositories/in-memory-shipment-attachments-repository";
import { makeAdmin } from "@/test/factories/make-admin";
import { makeShipment } from "@/test/factories/make-shipment";
import { ShipmentStatus } from "@/core/enums/shipment-status";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: MarkShipmentAsReturned

describe('Mark shipment as returned', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new MarkShipmentAsReturned(inMemoryShipmentsRepository, inMemoryAdminsRepository)
  })
  it('should be able to mark a shipment as returned', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      shipment: expect.objectContaining({
        statusShipment: ShipmentStatus.RETURNED
      })
    })
    expect(inMemoryShipmentsRepository.items[0]).toMatchObject({
      statusShipment: ShipmentStatus.RETURNED
    })
  })
  it('should not allow non-admin to mark a shipment as returned', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'invalid-admin-id',
      shipmentId: shipment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  it('should not allow status change if shipment does not exist', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: 'invalid-shipment-id'
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})