import { makeAdmin } from "test/factories/make-admin";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins";
import { InMemoryShipmentsRepository } from "test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryShipmentAttachmentsRepository } from "test/repositories/in-memory-shipment-attachments-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients";
import { makeShipment } from "test/factories/make-shipment";
import { ShipmentStatus } from "@/core/enums/shipment-status";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { MarkAsAwaitingPickupUseCase } from "./mark-as-awaiting-pickup";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: MarkAsAwaitingPickupUseCase

describe('Mark shipment as awaiting pickup', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    sut = new MarkAsAwaitingPickupUseCase(inMemoryShipmentsRepository, inMemoryAdminsRepository)
  })
  it('should update shipment status to awaiting pickup"', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      shipment: expect.objectContaining({
        statusShipment: ShipmentStatus.AWAITING_PICKUP
      })
    })
  })
  it('should not allow non-admin to mark shipment as awaiting pickup', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'invalid-admin-id',
      shipmentId: shipment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  it('should not be possible to change the status of a shipment that does not exist', async () => {
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