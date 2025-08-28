import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryShipmentsRepository } from "@/test/repositories/in-memory-shipments";
import { beforeEach, describe, expect, it } from "vitest";
import { GetShipmentForCourierUseCase } from "./get-shipment-for-courier";
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers";
import { InMemoryShipmentAttachmentsRepository } from "@/test/repositories/in-memory-shipment-attachments-repository";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { makeCourier } from "@/test/factories/make-courier";
import { makeShipment } from "@/test/factories/make-shipment";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentAttachmentsRepository: InMemoryShipmentAttachmentsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: GetShipmentForCourierUseCase

describe('Get Shipment For Courier', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentAttachmentsRepository = new InMemoryShipmentAttachmentsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository, inMemoryShipmentAttachmentsRepository)
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new GetShipmentForCourierUseCase(inMemoryShipmentsRepository, inMemoryCouriersRepository)
  })
  it('should allow a courier to get their own shipment', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const shipment = makeShipment({
      courierId: courier.id
    })
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: shipment.id.toString()
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      shipment: expect.objectContaining({
        id: shipment.id,
        courierId: courier.id
      })
    })
  })
  it('should not allow a non-existent courier to get a shipment', async () => {
    const shipment = makeShipment()
    inMemoryShipmentsRepository.items.push(shipment)

    const result = await sut.execute({
      courierId: 'non-existent-courier-id',
      shipmentId: shipment.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if shipment does not exist', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      shipmentId: 'non-existent-shipment-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
}) 