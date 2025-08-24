import { makeShipment } from "@/test/factories/make-shipment"
import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments"
import { beforeEach, describe, expect, it } from "vitest"
import { DeleteShipmentUseCase } from "./delete-shipment"
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients"
import { makeAdmin } from "@/test/factories/make-admin"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteShipmentUseCase

describe('Delete Shipment', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository)
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteShipmentUseCase(inMemoryShipmentsRepository, inMemoryAdminsRepository)
  })
  it('should be able to delete a shipment', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)
    const shipment = makeShipment()
    await inMemoryShipmentsRepository.create(shipment)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      shipmentId: shipment.id.toString()
    })
    
    expect(result.isRight()).toBe(true)
    expect(inMemoryShipmentsRepository.items).toHaveLength(0)
  })
  it('should not allow a non-admin user to delete a shipment', async () => {
    const shipment = makeShipment()
    await inMemoryShipmentsRepository.create(shipment)

    const result = await sut.execute({
      adminId: 'non-existent-admin-id',
      shipmentId: shipment.id.toString()
    })
    
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
})