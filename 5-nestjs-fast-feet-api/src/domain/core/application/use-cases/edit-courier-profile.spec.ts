import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeCourier } from 'test/factories/make-courier'
import { Location } from '../../enterprise/entities/value-objects/location'
import { EditCourierProfileUseCase } from './edit-courier-profile'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: EditCourierProfileUseCase

describe('Edit Courier by Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new EditCourierProfileUseCase(inMemoryCouriersRepository)
  })
  it('should be able to edit a courier', async () => {
    const courier = makeCourier({
      name: 'Initial Courier',
      location: Location.create({
        address: 'Initial Address',
        latitude: 10,
        longitude: 20,
      }),
    })

    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      name: 'Updated Courier',
      address: 'Updated Address',
      latitude: 30,
      longitude: 40,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      name: 'Updated Courier',
      location: expect.objectContaining({
        address: 'Updated Address',
        latitude: 30,
        longitude: 40,
      }),
    })
  })
})
