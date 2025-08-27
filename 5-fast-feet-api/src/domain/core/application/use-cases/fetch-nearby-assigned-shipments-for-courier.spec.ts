import { InMemoryRecipientsRepository } from '@/test/repositories/in-memory-recipients'
import { InMemoryShipmentsRepository } from '@/test/repositories/in-memory-shipments'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyAssignedShipmentsForCourierUseCase } from './fetch-nearby-assigned-shipments-for-courier'
import { InMemoryCouriersRepository } from '@/test/repositories/in-memory-couriers'
import { Location } from '../../enterprise/entities/value-objects/location'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeRecipient } from '@/test/factories/make-recipient'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { makeShipment } from '@/test/factories/make-shipment'
import { makeCourier } from '@/test/factories/make-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryShipmentsRepository: InMemoryShipmentsRepository
let sut: FetchNearbyAssignedShipmentsForCourierUseCase

describe('Fetch nearby shipments for courier use case', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryShipmentsRepository = new InMemoryShipmentsRepository(inMemoryRecipientsRepository)
    sut = new FetchNearbyAssignedShipmentsForCourierUseCase(inMemoryShipmentsRepository)
  })
  it('should be able to fetch nearby shipments for courier', async () => {
    const courier = makeCourier({}, new UniqueEntityID('courier-1'))
    await inMemoryCouriersRepository.create(courier)
    
    const recipient = makeRecipient({
      location: Location.create({
        address: 'Avenida Interlagos, 2000',
        latitude: -23.64052,
        longitude: -46.633308
      })
    })
    await inMemoryRecipientsRepository.create(recipient)
    
    const shipment = makeShipment({
      courierId: courier.id,
      recipientId: recipient.id,
      pickupDate: new Date(),
      statusShipment: ShipmentStatus.PICKED_UP
    })
    await inMemoryShipmentsRepository.create(shipment)
    
    const result = await sut.execute({
      courierId: courier.id.toString(),
      maxDistanceInKm: 15,
      courierLatitude: -23.64052,
      courierLongitude: -46.633308,
      page: 1
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.shipments).toHaveLength(1)
    expect(result.value?.shipments[0].courierId).toEqual(courier.id)
  })

  it('should not be able to fetch shipments assigned to other couriers', async () => {
    const courier1 = makeCourier({}, new UniqueEntityID('courier-1'))
    const courier2 = makeCourier({}, new UniqueEntityID('courier-2'))
    await inMemoryCouriersRepository.create(courier1)
    await inMemoryCouriersRepository.create(courier2)
    
    const recipient = makeRecipient({
      location: Location.create({
        address: 'Avenida Interlagos, 2000',
        latitude: -23.64052,
        longitude: -46.633308
      })
    })
    await inMemoryRecipientsRepository.create(recipient)
    
    // Shipment assigned to courier1
    const shipment1 = makeShipment({
      courierId: courier1.id,
      recipientId: recipient.id,
      pickupDate: new Date(),
      statusShipment: ShipmentStatus.PICKED_UP
    })
    await inMemoryShipmentsRepository.create(shipment1)

    // Shipment assigned to courier2
    const shipment2 = makeShipment({
      courierId: courier2.id,
      recipientId: recipient.id,
      pickupDate: new Date(),
      statusShipment: ShipmentStatus.PICKED_UP
    })
    await inMemoryShipmentsRepository.create(shipment2)
    
    // Try to fetch shipments for courier1
    const result = await sut.execute({
      courierId: courier1.id.toString(),
      maxDistanceInKm: 15,
      courierLatitude: -23.64052,
      courierLongitude: -46.633308,
      page: 1
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.shipments).toHaveLength(1)
    expect(result.value?.shipments[0].courierId).toEqual(courier1.id)
  })
  it('should be able to fetch paginated nearby assigned shipments for courier', async () => {
    const courier = makeCourier({}, new UniqueEntityID('courier-1'))
    await inMemoryCouriersRepository.create(courier)

    const recipient = makeRecipient({
      location: Location.create({
        address: 'Rua das Flores, 100',
        latitude: -23.64052,
        longitude: -46.633308
      })
    })
    await inMemoryRecipientsRepository.create(recipient)

    // Create 22 shipments assigned to the same courier and recipient
    for (let i = 1; i <= 22; i++) {
      const shipment = makeShipment({
        courierId: courier.id,
        recipientId: recipient.id,
        pickupDate: new Date(),
        statusShipment: ShipmentStatus.PICKED_UP
      })
      await inMemoryShipmentsRepository.create(shipment)
    }

    // Fetch page 2 (assuming page size is 20)
    const result = await sut.execute({
      courierId: courier.id.toString(),
      maxDistanceInKm: 15,
      courierLatitude: -23.64052,
      courierLongitude: -46.633308,
      page: 2
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.shipments).toHaveLength(2)
  })

})  
