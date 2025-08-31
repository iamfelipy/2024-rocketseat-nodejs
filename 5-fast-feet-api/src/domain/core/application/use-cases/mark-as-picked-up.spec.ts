import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { InMemoryShipmentAttachmentsRepository } from "@/test/repositories/in-memory-shipment-attachments-repository";
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers";
import { MarkShipmentAsPickedUp } from "./mark-as-picked-up";
import { makeAdmin } from "@/test/factories/make-admin";
import { makeCourier } from "@/test/factories/make-courier";
import { makeShipment } from "@/test/factories/make-shipment";
import { ShipmentStatus } from "@/core/enums/shipment-status";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: MarkShipmentAsPickedUp


describe('Mark shipment as picked up', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    sut = new MarkShipmentAsPickedUp(inMemoryShipmentsRepository, inMemoryCouriersRepository, inMemoryAdminsRepository)
  })
  it('should be able to mark shipment as pickep up', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const shipment = makeShipment({
      statusShipment: ShipmentStatus.AWAITING_PICKUP
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString()
    })
    
    expect(result.isRight()).toBe(true)
    expect(inMemoryShipmentsRepository.items[0]).toEqual(
      expect.objectContaining({
        statusShipment: ShipmentStatus.PICKED_UP,
        courierId: courier.id,
        pickupDate: expect.any(Date)
      })
    )
    expect(result.value).toEqual({
      shipment: expect.objectContaining({
        statusShipment: ShipmentStatus.PICKED_UP,
        courierId: courier.id,
        pickupDate: expect.any(Date)
      })
    })
  })
  it('should allow only admin to mark a shipment as picked up', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)
    const shipment = makeShipment({
      statusShipment: ShipmentStatus.AWAITING_PICKUP
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'invalid-admin-id',
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString()
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
  it('should not allow changing the status for a non-existent courier', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const shipment = makeShipment({
      statusShipment: ShipmentStatus.AWAITING_PICKUP
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: 'invalid-courier-id',
      shipmentId: shipment.id.toString()
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not allow changing the status for a non-existent shipment', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      courierId: courier.id.toString(),
      shipmentId: 'invalid-shipment-id'
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})