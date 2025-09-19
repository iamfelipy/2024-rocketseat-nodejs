import { InMemoryShipmentsRepository } from "test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchShipmentsUseCase } from "./fetch-shipments";
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients";
import { InMemoryShipmentAttachmentsRepository } from "test/repositories/in-memory-shipment-attachments-repository";
import { makeShipment } from "test/factories/make-shipment";
import { makeAdmin } from "test/factories/make-admin";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchShipmentsUseCase

describe('Fetch Shipments', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new FetchShipmentsUseCase(inMemoryShipmentsRepository, inMemoryAdminsRepository)
  })
  it('should be able to fetch shipments', async () => {
    
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    inMemoryShipmentsRepository.items.push(
      makeShipment(),
      makeShipment()
    )

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.shipments).toHaveLength(2)
    }
  })
  it('should be able to fetch paginated shipments', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)
    
    for(let i = 1; i <= 22; i++) {
      inMemoryShipmentsRepository.items.push(makeShipment())
    }
    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 2
    })

    expect(result.isRight()).toBe(true)
    if(result.isRight()) {
      expect(result.value.shipments).toHaveLength(2)
    }
  })
})