import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { InMemoryShipmentAttachmentsRepository } from "@/test/repositories/in-memory-shipment-attachments-repository";
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { GetShipmentUseCase } from "./get-shipment";
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { makeShipment } from "@/test/factories/make-shipment";
import { makeAdmin } from "@/test/factories/make-admin";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: GetShipmentUseCase

describe('Get Shipment', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    sut = new GetShipmentUseCase(inMemoryShipmentsRepository, inMemoryAdminsRepository)
  })
  it('should be able to get a shipment', async () => {
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
        id: shipment.id
      })
    })
  })
  it('should not allow non-admin to get a shipment', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      adminId: 'invalid-id-admin',
      shipmentId: shipment.id.toString()
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
      shipmentId: 'non-existent-shipment-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})